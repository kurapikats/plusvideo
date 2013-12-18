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

/*use Aws\CloudFront\CloudFrontClient;
require_once '../libraries' . DIRECTORY_SEPARATOR . 'aws.phar';
*/
require_once '../PlusVideo.php';

$userSettings = 'settings.vast.user.conf';
$defaultSettings = 'settings.vast.defaults.conf';
$votp = new PlusVideo($userSettings, $defaultSettings);

$pathAndUrl = $votp->getPathAndUrl();

$jsTemplate = '..' . DIRECTORY_SEPARATOR . 'templates' . DIRECTORY_SEPARATOR . 'vast.js';

$jsOutFile = $pathAndUrl['localCreativeDir'] . DIRECTORY_SEPARATOR . 'd30_player.js';

$result = $votp->processJs($jsTemplate, $jsOutFile, true, false);

print_r($result);



/*$client = CloudFrontClient::factory(
    array(
        'key' => 'AKIAJZ3AOW4F3JJ2H6DA',
        'secret' => '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'
    )
);

var_dump($client);
exit; */
/*
$result = $client->createInvalidation(array(
    // DistributionId is required
    'DistributionId' => 'string',
    // Paths is required
    'Paths' => array(
        // Quantity is required
        'Quantity' => integer,
        'Items' => array('string', ... ),
    ),
    // CallerReference is required
    'CallerReference' => 'string',
));
*/