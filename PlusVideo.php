<?php
/**
 * PlusVideo: Combine config and upload to S3 and Cloudfront
 *
 * @category  Advertising
 * @package   VideoOtp
 * @author    Jesus B. Nana <jesus.nana@adtouch.com>
 * @copyright 2013 VideoOTP
 * @license   [url] [description]
 * @version   0.1
 * @link      http://videootp.com
 */
namespace VideoOtp\PlusVideo;

use VideoOtp\S3Uploader;

require_once 'S3Uploader.php';

/**
 * S3 Uploader
 *
 * @category S3
 * @package  Amazon
 * @author   Jesus B. Nana <jesus.nana@adtouch.com>
 * @license  [url] [description]
 * @version  0.1
 * @link     http://videootp.com
 */
class PlusVideo
{
    private $_conf;
    private $_accessKey;
    private $_secretKey;

    /**
     * [__construct description]
     */
    public function __construct()
    {
        $this->_conf = $this->loadConfig(__DIR__ . '/' . 'access.conf');
        $this->_accessKey = $this->_conf->AWS->accessKey;
        $this->_secretKey = $this->_conf->AWS->secretKey;
    }

    /**
     * [loadConfig description]
     *
     * @param string $file [comment]
     *
     * @return [type]
     */
    public function loadConfig($file)
    {
        $source = $file;

        if (file_exists($source)) {
            $content = file_get_contents($source);
            $data = json_decode($content);

            return $data;
        } else {
            echo $source;
        }

        return false;
    }

    /**
     * Pass the js file to process
     *
     * @param string $jsFile relative path of js file
     *
     * @return mixed
     */
    public function processJs($jsFile)
    {
        $this->_createBackup($jsFile);

        $jsFileContent = file_get_contents($jsFile);
        // match all the configuration variable and put inside $contentVars
        $contentVars = array();
        $userVarPattern = '/^.*\bVOTP(.*)\b.*$/m';
        preg_match_all($userVarPattern, $jsFileContent, $contentVars);

        $replacements = $this->_mergeDefaultValues();

        $patterns = array();
        if (isset($contentVars) && !empty($contentVars)) {
            foreach ($contentVars[1] as $v) {
                $votpConfVar = 'VOTP' . $v;
                $patterns[$votpConfVar] = '/{' . $votpConfVar . '}/';
            }
        }

        // always ksort both arrays when doing preg_replace
        ksort($patterns);
        ksort($replacements);
        $updatedJs = preg_replace($patterns, $replacements, $jsFileContent);

        file_put_contents($jsFile, $updatedJs);
    }

    /**
     * Alias of loadConfig(), get the user's configurations
     *
     * @param string $defaultConfFile path to config file
     * @param string $userConfFile    path to config file
     *
     * @return [type]
     */
    private function _mergeDefaultValues(
        $defaultConfFile = 'defaults.conf',
        $userConfFile = 'settings.conf'
    ) {
        $defaultValues = (array) $this->parseUserValues($defaultConfFile);
        $userValues = (array) $this->parseUserValues($userConfFile);

        $mergedValues = array_merge($defaultValues, $userValues);

        return $mergedValues;
    }


    /**
     * Alias of loadConfig(), get the user's configurations
     *
     * @param string $configFile path to config file
     *
     * @return [type]
     */
    public function parseUserValues($configFile = 'settings.conf')
    {
        return $this->loadConfig($configFile);
    }

    /**
     * [getVastXmlFromJs description]
     *
     * @param string $path2D30Js ie. dir/d30_player.js
     *
     * @return mixed minified vastXML on success
     *                false on failure
     */
    public function getVastXmlFromJs($path2D30Js)
    {
        if (file_exists($path2D30Js)) {
            $source = file_get_contents($path2D30Js);
        } else {
            return false;
        }

        $matches = array();
        preg_match(
            '/shortTail_D30.vastXML = \'\<\?xml(.*)/', $source, $matches
        );

        if (isset($matches[1]) AND !empty($matches[1])) {
            // append the opening xml tag
            $opXml = '<?xml';
            $vastXml = $opXml . $matches[1];

            return $vastXml;
        }

        return false;
    }

    /**
     * Creates a backup of the target file
     *
     * @param string $file [description]
     *
     * @return $mixed filename of the backup file on success
     *                false on failure
     */
    private function _createBackup($file)
    {
        if (file_exists($file)) {
            // append timestamp on backup filename
            $pathInfo = pathinfo($file);
            $backupFile = $pathInfo['dirname'] . '/' . $pathInfo['filename'] .
                '.' . date('m-d-Y-h-i-s') . '.' . $pathInfo['extension'] .
                '.bak';

            if (!copy($file, $backupFile)) {
                throw new \Exception(
                    sprintf('Unable to backup "%s" ', $file)
                );
            }

            return $backupFile;

        } else {
            throw new \Exception(
                sprintf('File "%s" doesn\'t exist', $file)
            );
        }

        return false;
    }
}

