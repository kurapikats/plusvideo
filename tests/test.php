<?php
/**
 * Amazon S3 File and Directory Uploader for VideoOTP
 *
 * @category  Cloud_Computing
 * @package   VideoOtp_Amazon
 * @author    Jesus B. Nana <jesus.nana@adtouch.com>
 * @copyright 2013 VideoOTP
 * @license   [url] [description]
 * @version   0.1
 * @link      http://videootp.com
 */
namespace VideoOtp\PlusVideo;

require_once '../PlusVideo.php';

$userSettings = 'settings.vast.user.conf';
$defaultSettings = 'settings.vast.defaults.conf';
$votp = new PlusVideo($userSettings, $defaultSettings);

$pathAndUrl = $votp->getPathAndUrl();
//$pathAndUrl['localTestServer'];

$jsTemplate = '..' . DIRECTORY_SEPARATOR . 'templates' . DIRECTORY_SEPARATOR . 'vast.js';

$jsOutFile = $pathAndUrl['localCreativeDir'] . DIRECTORY_SEPARATOR . 'd30_player.js';

$result = $votp->processJs($jsTemplate, $jsOutFile, true, false);

print_r($result);

