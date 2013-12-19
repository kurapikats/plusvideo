<?php

/**
 * PlusVideo: Combine config and upload to S3 and Cloudfront
 *
 * @category  Advertising
 * @package   VideoOtp
 * @author    Jesus B. Nana <jesus.nana@adtouch.com>
 * @copyright 2013 VideoOTP
 * @license   [url] [description]
 * @version   0.2
 * @link      http://www.videootp.com
 */
namespace VideoOtp\PlusVideo;

require_once 'S3Uploader.php';

/**
 * PlusVideo
 *
 * @category Advertising
 * @package  VideoOtp
 * @author   Jesus B. Nana <jesus.nana@adtouch.com>
 * @license  [url] [description]
 * @version  0.2
 * @link     http://www.videootp.com
 */
class PlusVideo
{
    private $_s3Uploader;
    private $_userValues;
    private $_userConfFile;

    /**
     * Load and merge the user and default config file
     *
     * @param string $userConfFile Full path of the uploaded user config file
     */
    public function __construct($userConfFile)
    {
        $access = $this->loadConfig(
            __DIR__ . DIRECTORY_SEPARATOR . 'access.conf'
        );

        // merge users config to it's default config file
        $this->_userValues = $this->_mergeConfFiles($userConfFile);

        $this->_userConfFile = $userConfFile;

        $this->_s3Uploader = new \VideoOtp\S3Uploader\S3Uploader($access);
    }

    /**
     * Upload the target directory to Amazon S3
     *
     * @param string $updatedContent Content of the JS file
     *
     * @return mixed URL of the preview tag and the js file
     */
    public function uploadDirToS3($updatedContent)
    {
        $scriptFilename = 'd30_player.js';

        $productionServer = $this->_userValues['VOTP_AD_PRODUCTION_SERVER'] .
            '/' . $this->_userValues['VOTP_AD_CONTAINER'] . '/';
        $preview = $productionServer . 'index.html';
        $tag = $productionServer . $scriptFilename;

        $pathAndUrl = $this->getPathAndUrl();
        $pathAndUrl['productionPreview'] = $preview;
        $pathAndUrl['productionTag'] = $tag;

        //TODO: vast specific
        // update logo using production url
        if ($this->_userValues['VOTP_AD_TYPE'] == 'vast') {
            $logoFilename = $productionServer .
                $this->_userValues['VOTP_AD_SPONSOR_LOGO'];
            $updatedContent = $this->_updateLogoConf($logoFilename, $updatedContent);
        } else if ($this->_userValues['VOTP_AD_TYPE'] == 'image') {
            //TODO: image specific
            $imgUrl = $productionServer .
                $this->_userValues['VOTP_AD_IMAGE_FILENAME'];
            $updatedContent = $this->_updateImageFilename($imgUrl, $updatedContent);
        }

        $this->_s3Uploader->uploadDirectory(
            $pathAndUrl['localCreativeDir']
        );

        $data = array();
        $data['productionPreview'] = $preview;
        $data['productionTag'] = $tag;

        return $data;
    }

    /**
     * Load the config file
     *
     * @param string $file Full path of the config file
     *
     * @return mixed Parsed config file
     */
    public function loadConfig($file)
    {
        if ($data = @parse_ini_file($file)) {
            return $data;
        }

        echo 'Not a config file ' . $file;
        echo '<br><a href="index.php">Back</a>';
        exit;
    }

    /**
     * Pass the js file to process
     *
     * @param boolean $upload Upload to CDN
     * @param boolean $backup Enable backup
     *
     * @return mixed Test and CDN URL for Preview and JS Tag
     */
    public function processJs($upload = "false", $backup = "false")
    {
        if ($backup == "true") {
            $this->_createBackup($this->_userConfFile);
        }

        $jsFile = $this->getTemplateFile();
        $jsFileContent = file_get_contents($jsFile);

        $jsOutFile = $this->getD30FilePath();

        $userValues = $this->_userValues;
        $pathAndUrl = $this->getPathAndUrl();

        // use the jsFileContent since we don't need to process vast xml
        $updatedContent = $jsFileContent;

        // match all the conf variables on the js and put inside $contentVars
        $contentVars = array();
        $userVarPattern = '/^.*\bVOTP(.*)\b.*$/m';
        preg_match_all($userVarPattern, $updatedContent, $contentVars);

        // extract the template vars from the js
        $patterns = array();
        if (isset($contentVars) && !empty($contentVars)) {
            foreach ($contentVars[1] as $v) {
                $votpConfVar = 'VOTP' . $v;
                $patterns[$votpConfVar] = '/{' . $votpConfVar . '}/';
            }
        }

        // TODO: vast specific
        // update logo path and return the updated js content
        if ($upload != "true") {
            if ($userValues['VOTP_AD_TYPE'] == 'vast') {
                $logoFilename = $pathAndUrl['localTestServer'] . '/' .
                    $userValues['VOTP_AD_SPONSOR_LOGO'];
                $updatedContent = $this->_updateLogoConf(
                    $logoFilename, $updatedContent
                );
            } else if ($userValues['VOTP_AD_TYPE'] == 'image') {
                // TODO: image specific
                $imageFilename = $pathAndUrl['localTestServer'] . '/' .
                    $userValues['VOTP_AD_IMAGE_FILENAME'];
                $updatedContent = $this->_updateImageFilename(
                    $imageFilename, $updatedContent
                );
            }
        }

        $replacements = array();
        foreach ($patterns as $k => $v) {

            // trim non-existing keys on $userValues
            if (isset($userValues[$k])) {
                $replacements[$k] = $userValues[$k];
            }

            // empty user config variable will be reverted to template variable
            if (empty($replacements[$k]) && $userValues[$k] != "0") {
                $replacements[$k] = '{' . $k . '}';
            }
        }

        // always ksort both arrays when doing preg_replace
        ksort($patterns);
        ksort($replacements);
        // use the updated content $updatedContent
        $updatedJs = preg_replace($patterns, $replacements, $updatedContent);
        $result = file_put_contents($jsOutFile, $updatedJs);

        // copy the index.html template to target directory for previewing
        $indexTemplate = '..' . DIRECTORY_SEPARATOR . 'templates' .
            DIRECTORY_SEPARATOR . 'index.html';

        $absoluteCreativeDir = $pathAndUrl['localCreativeDir'];

        copy(
            $indexTemplate, $absoluteCreativeDir . DIRECTORY_SEPARATOR .
            'index.html'
        );

        if ($upload == "true") {
            return $this->uploadDirToS3($updatedContent);
        }

        $data['localTestServer'] = $pathAndUrl['localTestServer'];

        return $data;
    }

    /**
     * Get the Local path and Test URL of the creative
     *
     * @return mixed Local path and Test server url
     */
    public function getPathAndUrl()
    {
        $userValues = $this->_userValues;

        $absoluteCreativeDir =  $userValues['VOTP_AD_LOCAL_DIRECTORY'] .
            DIRECTORY_SEPARATOR . $userValues['VOTP_AD_CONTAINER'];
        $localServer = $userValues['VOTP_AD_LOCAL_TEST_SERVER'] . '/' .
            $userValues['VOTP_AD_CONTAINER'];

        if (!file_exists($absoluteCreativeDir)) {
            mkdir($absoluteCreativeDir, 0777, true);
        }

        $data['localCreativeDir'] = $absoluteCreativeDir;
        $data['localTestServer'] = $localServer;

        // TODO: move this somewhere
        if (!empty($userValues['VOTP_AD_SPONSOR_LOGO'])) {
            $logoFilename = $userValues['VOTP_AD_SPONSOR_LOGO'];
            $data['logoFilename'] = $logoFilename;
        }

        return $data;
    }

    /**
     * Replace the logo url based on user settings
     *
     * @param string $logoFilename   Filename of the logo
     * @param string $updatedContent Content of the JS template
     *
     * @return string Updated JS content
     */
    private function _updateLogoConf($logoFilename, $updatedContent)
    {
        return preg_replace(
            '/{VOTP_AD_SPONSOR_LOGO}/', $logoFilename, $updatedContent
        );
    }

    /**
     * Replace the logo url based on user settings
     *
     * @param string $imageFilename  Filename of the logo
     * @param string $updatedContent Content of the JS template
     *
     * @return string Updated JS content
     */
    private function _updateImageFilename($imageFilename, $updatedContent)
    {
        return preg_replace(
            '/{VOTP_AD_IMAGE_FILENAME}/', $imageFilename, $updatedContent
        );
    }

    /**
     * Merge the user config file with the default
     * If user didn't specify a value for a configuration it will use the
     * default settings
     *
     * @param string $userConfFile Full path of the config file
     *
     * @return mixed Merged values of the config files
     */
    private function _mergeConfFiles($userConfFile)
    {
        $userValues = $this->parseUserValues($userConfFile);

        $defaultConfFile = $this->getDefaultConfFile($userValues);

        $defaultValues = $this->parseUserValues($defaultConfFile);

        foreach ($defaultValues as $k => $v) {
            if (!empty($userValues[$k])) {
                $mergedValues[$k] = $userValues[$k];
            } else {
                $mergedValues[$k] = $defaultValues[$k];
            }
        }

        return $mergedValues;
    }

    /**
     * Alias of loadConfig(), get the user's configurations
     *
     * @param string $configFile Full path to config file
     *
     * @return mixed Parsed config file
     */
    public function parseUserValues($configFile)
    {
        return $this->loadConfig($configFile);
    }

    /**
     * Creates a backup of the target file, append timestamp and .bak
     * on the backup file
     *
     * @param string $file Full path of the file to backup
     *
     * @return $mixed filename of the backup file on success, false on failure
     */
    private function _createBackup($file)
    {
        if (file_exists($file)) {
            // append timestamp on backup filename
            $pathInfo = pathinfo($file);
            $backupFile = $pathInfo['dirname'] . DIRECTORY_SEPARATOR .
                $pathInfo['filename'] . '.' . date('m-d-Y-h-i-s') . '.' .
                $pathInfo['extension'] . '.bak';

            if (!copy($file, $backupFile)) {
                throw new \Exception(
                    sprintf('Unable to backup "%s" ', $file)
                );
            }

            return $backupFile;
        }

        return false;
    }

    /**
     * Rename the uploaded logo based on the filename on the user config file
     *
     * @param mixed $uploadedFile File info from $_FILES
     *
     * @return boolean True on successful file upload
     */
    public function renameUploadedFile($uploadedFile)
    {
        $pathAndUrl = $this->getPathAndUrl();

        if (isset($pathAndUrl['logoFilename'])) {
            $filename = $pathAndUrl['logoFilename'];
        } else {
            $filename = $uploadedFile['ad_image']['name'];
        }

        $fileUri = $pathAndUrl['localCreativeDir'] . $filename;
        move_uploaded_file($uploadedFile['ad_image']['tmp_name'], $fileUri);

        // move the uploaded file to target path and filename
        $imageFilename = $votp->getImageFilename();

        return rename($fileUri, $imageFilename);
    }

    /**
     * Renames the uploaded logo based on the filename on the user config file
     * if the user uploaded a logo and didn't specify a filename on the config
     * use the default logo filename from it's default config file
     *
     * @return mixed Filename of the Logo
     */
    public function vastGetLogoFilename()
    {
        $pathAndUrl = $this->getPathAndUrl();

        $logoFilename = $pathAndUrl['localCreativeDir'] .
            $this->_userValues['VOTP_AD_SPONSOR_LOGO'];

        if (!empty($this->_userValues['VOTP_AD_SPONSOR_LOGO'])) {
            return $logoFilename;
        }

        return false;
    }

    /**
     * Get the Image filename, this can be logo or bg image
     * If VOTP_AD_TYPE is vast use image as logo, if not use it as bg image
     *
     * @return string Full path of the image file
     */
    public function getImageFilename()
    {
        if ($this->_userValues['VOTP_AD_TYPE'] == 'vast') {
            $imageFilename = $this->vastGetLogoFilename();
        } else {
            // use filename from image conf file
            $imageFilename = $pathAndUrl['localCreativeDir'] .
                $this->_userValues['VOTP_AD_IMAGE_FILENAME'];
        }

        return $imageFilename;
    }

    /**
     * Get the local path for d30 player
     *
     * @return string Full path of d30_player.js
     */
    public function getD30FilePath()
    {
        $pathAndUrl = $this->getPathAndUrl();
        $localCreativeDir = $pathAndUrl['localCreativeDir'] .
            DIRECTORY_SEPARATOR;

        return $localCreativeDir . 'd30_player.js';
    }

    /**
     * Get the JS template file
     *
     * @return string Full path of the js template file
     */
    public function getTemplateFile()
    {
        $jsTemplate = '..' . DIRECTORY_SEPARATOR . 'templates' .
        DIRECTORY_SEPARATOR . $this->_userValues['VOTP_AD_TYPE'] . '.js';

        return $jsTemplate;
    }

    /**
     * Get the default configuration for the template
     *
     * @param mixed $userValues Parsed ini configuration
     *
     * @return string Full path of the matching config file
     */
    public function getDefaultConfFile($userValues)
    {
        // get the appropriate default template config file
        $defaultSettings = '../templates/settings.' .
            $userValues['VOTP_AD_TYPE'] . '.defaults.conf';

        return $defaultSettings;
    }
}
