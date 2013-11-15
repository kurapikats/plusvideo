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
use VideoOtp\Xml;

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
    private $_s3Uploader;
    private $_userValues;
    private $_userConfFile;

    /**
     * [__construct description]
     */
    public function __construct($userConfFile, $defaultConfFile)
    {
        $access = $this->loadConfig(
            __DIR__ . DIRECTORY_SEPARATOR . 'access.conf'
        );

        $this->_userValues = $this->_mergeConfFiles(
            $userConfFile, $defaultConfFile
        );

        $this->_userConfFile = $userConfFile;

        $this->_s3Uploader = new \VideoOtp\S3Uploader\S3Uploader($access);
    }

    public function uploadDirToS3($updatedContent)
    {
        $productionServer = $this->_userValues['VOTP_AD_PRODUCTION_SERVER'] .
            '/' . $this->_userValues['VOTP_AD_CONTAINER'] . '/';
        $preview = $productionServer . 'index.html';
        $tag = $productionServer . 'd30_player.js';

        $pathAndUrl = $this->getPathAndUrl();
        $pathAndUrl['productionPreview'] = $preview;
        $pathAndUrl['productionTag'] = $tag;

        // update logo using production url
        $logoUrl = $productionServer .
            $this->_userValues['VOTP_AD_SPONSOR_LOGO'];
        $updatedContent = $this->_updateLogoUrl($logoUrl, $updatedContent);

        $this->_s3Uploader->uploadDirectory(
            $pathAndUrl['localCreativeDir']
        );

        return $pathAndUrl;
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
     * @param string $jsFile relative path of js file
     *
     * @return mixed
     */
    public function processJs($jsFile, $jsOutFile, $upload = false, $backup = false)
    {
        if ($backup) {
            $this->_createBackup($this->_userConfFile);
        }

        $jsFileContent = file_get_contents($jsFile);

        $userValues = $this->_userValues;

        // TODO: vast specific: set the vast xml variable, move somewhere
        if (!empty($userValues['VOTP_AD_VAST_XML_URL'])) {
            $updatedContent = $this->_processVastXml(
                $userValues['VOTP_AD_VAST_XML_URL'], $jsFileContent, $jsOutFile
            );
        }

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

        // update logo path and return the updated js content
        $pathAndUrl = $this->getPathAndUrl();
        $logoUrl = $pathAndUrl['localTestServer'] . '/' .
            $userValues['VOTP_AD_SPONSOR_LOGO'];

        $updatedContent = $this->_updateLogoUrl($logoUrl, $updatedContent);

        $replacements = array();
        foreach($patterns as $k => $v) {

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


        if ($upload == true) {
            return $this->uploadDirToS3($updatedContent);
        }

        return $pathAndUrl;
    }

    public function getPathAndUrl()
    {
        $userValues = $this->_userValues;

        $absoluteCreativeDir =  $userValues['VOTP_AD_LOCAL_DIRECTORY'] .
            DIRECTORY_SEPARATOR . $userValues['VOTP_AD_CONTAINER'];
        $localServer = $userValues['VOTP_AD_LOCAL_TEST_SERVER'] . '/' .
            $userValues['VOTP_AD_CONTAINER'];

        $data['localCreativeDir'] = $absoluteCreativeDir;
        $data['localTestServer'] = $localServer;

        return $data;
    }

    private function _updateLogoUrl($logoUrl, $updatedContent)
    {
        return preg_replace(
            '/{VOTP_AD_SPONSOR_LOGO}/', $logoUrl, $updatedContent
        );
    }

    /**
     * Alias of loadConfig(), get the user's configurations
     *
     * @param string $defaultConfFile path to config file
     * @param string $userConfFile    path to config file
     *
     * @return [type]
     */
    private function _mergeConfFiles($userConfFile, $defaultConfFile) {

        $userValues = $this->parseUserValues($userConfFile);
        $defaultValues = $this->parseUserValues($defaultConfFile);

        foreach($defaultValues as $k => $v) {
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
     * @param string $configFile path to config file
     *
     * @return [type]
     */
    public function parseUserValues($configFile)
    {
        return $this->loadConfig($configFile);
    }

    /**
     * TODO: Move this to another location
     * @param  [type] $vastUrl       [description]
     * @param  [type] $jsFileContent [description]
     * @param  [type] $jsOutFile     [description]
     * @return [type]                [description]
     */
    private function _processVastXml($vastUrl, $jsFileContent, $jsOutFile)
    {
        // TODO: vast specific: set the vast xml variable, move somewhere
        $vastXml = trim($this->getVastXml($vastUrl));

        $updatedContent = preg_replace(
            '/{CUSTOM_VAST_XML_CONTENT}/', $vastXml, $jsFileContent
        );

        file_put_contents($jsOutFile, $updatedContent);

        return $updatedContent;
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

    public function getVastXml($url)
    {
        $vastXml = simplexml_load_file($url);
        $d30Config = new \SimpleXMLElement($vastXml->asXML());

        $extension = $d30Config->Ad->InLine->Extensions->addChild('Extension');
        $extension->addAttribute('type', 'D30Config');

        $extension->addChild('BaseColor', '\' + shortTail_D30.AD_BASE_COLOR + \'');
        $extension->addChild('FontColor', '\' + shortTail_D30.AD_FONT_COLOR + \'');
        $extension->addChild('ProgressColor', '\' + shortTail_D30.AD_PROGRESS_COLOR + \'');
        $extension->addChild('SponsorExtrasBgrndColor', '\' + shortTail_D30.AD_SPONSOR_BG_COLOR + \'');
        $extension->addChild('AutoPlay', '\' + shortTail_D30.AD_AUTOPLAY + \'');
        $extension->addChild('Volume', '\' + shortTail_D30.AD_VOLUME + \'');
        $extension->addChild('Muted', '\' + shortTail_D30.AD_MUTED + \'');

        $extension->addChild('SecsAllowedToView', '\' + shortTail_D30.AD_AUTO_PAUSE_VIDEO + \'');
        $extension->addChild('SecsAllowedToViewCloseDelay', '\' + shortTail_D30.AD_CLICK_TO_CONTINUE + \'');
        $extension->addChild('SecsAllowedToViewLabel', '\' + shortTail_D30.AD_C_TO_CONTINUE_TXT + \'');
        $extension->addChild('AdCountdownLabel', '\' + shortTail_D30.AD_COUNTDOWN_LABEL + \'');
        $extension->addChild('SecsRequiredToView', '\' + shortTail_D30.AD_REQ_VIEWING_TIME + \'');

        $extension->addChild('LogoVisible', 'false');
        $extension->addChild('LogoSecsVisible', '0');
        $extension->addChild('ScaleMode', 'uniform');
        $extension->addChild('VMEnabled', 'false');
        $extension->addChild('SponsorByLabel', '\' + shortTail_D30.AD_SPONSOR_BY_LABEL + \'');
        $extension->addChild('SponsorExtrasLabel');

        $creative = $d30Config->Ad->InLine->Creatives->addChild('Creative');
        $creative->addAttribute('id', 'Companion');
        $companionAds = $creative->addChild('CompanionAds');
        $companion = $companionAds->addChild('Companion');
        $companion->addAttribute('id', 'sponsor');
        $companion->addAttribute('width', '88');
        $companion->addAttribute('height', '31');

        $staticResource = $companion->addChild('StaticResource', '\' + shortTail_D30.AD_SPONSOR_LOGO + \'');
        $staticResource->addAttribute('creativeType', 'image/jpg');
        $companion->addChild('CompanionClickThrough', '\' + shortTail_D30.AD_SPONSOR_LOGO_LINK + \'');

        $companion->addChild('AltText', 'Us');
        $companion->addChild('AdParameters');

        $minXml = preg_replace('/>\s+</', '><', $d30Config->asXML());

        return $minXml;
    }
}


