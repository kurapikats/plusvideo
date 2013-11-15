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
namespace VideoOtp\S3Uploader;

use Aws\S3\S3Client;

require_once 'libraries' . DIRECTORY_SEPARATOR . 'aws.phar';

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
class S3Uploader
{

    private $_client;
    private $_bucket;

    /**
     * Pass the amazon access key/secret
     * $access['key']
     * $access['secret']
     *
     * @param array  $access Amazon access credentials
     * @param string $bucket S3 bucket name
     */
    public function __construct(array $access = array(), $bucket = 'video-d30')
    {
        // TODO: add checking here
        $this->_client = S3Client::factory(
            array(
                'key' => $access['key'],
                'secret' => $access['secret']
            )
        );

        $this->_bucket = $bucket;

        $this->_client->registerStreamWrapper();
    }

    /**
     * Upload a file on S3, if the file exist backup the old file
     * and append timestamp on the filename
     *
     * @param string $filename        local file to be uploaded,
     *                                relative or absolute file
     * @param string $remoteDirectory Remote directory where to upload the file
     * @param string $prefix          Defaults to "a-", this is to make
     *                                browsing on S3 console easier
     *
     * @return mixed url generated S3 url or false on failure
     */
    public function uploadFile($filename, $remoteDirectory = "")
    {
        if (file_exists($filename)) {

            // use this as remote filename,
            $basename = pathinfo($filename)['basename'];

            if (!empty($remoteDirectory)) {
                $key = str_replace('/', '', $remoteDirectory) . '/' . $basename;
            } else {
                $key = $basename;
            }

            try {
                $s3Url = 's3://' . $this->_bucket . '/';

                // if it already exist on the bucket rename it
                if (file_exists($s3Url . $key)) {
                    $newName = $key . '-' . date('mdy-His');
                    rename($s3Url . $key, $s3Url . $newName);
                }

                // Upload an object to Amazon S3
                $result = $this->_client->putObject(
                    array(
                        'Bucket' => $this->_bucket,
                        'Key' => $key,
                        'SourceFile' => $filename,
                        'ACL' => 'public-read',
                    )
                );

                return $result['ObjectURL'];

            } catch (\Exception $e) {
                throw new \Exception($e->getMessage());
            }
        } else {
            throw new \Exception(
                sprintf('File "%s" doesn\'t exist', $filename)
            );
        }

        return false;
    }

    /**
     * Upload a directory to S3
     * ie. uploading D:\projects\sandbox\video-otp
     * will use 'video-otp' as it's remote directory
     *
     * @param string $localDirectory Target directory to upload
     * @param string $prefix         Defaults to "a-", this is to make
     *                               browsing on S3 console easier
     *
     * @return mixed Array of uploaded files on success
     *               false on failure
     */
    public function uploadDirectory($localDirectory, $prefix = "a-")
    {
        if (file_exists($localDirectory) && is_dir($localDirectory)) {

            // use the current directory as remote directory
            $path = explode(DIRECTORY_SEPARATOR, $localDirectory);
            $remoteDirectory = end($path);
            $uploaded = array();

            // append prefix if it doesn't exist on directory name
            $matches = array();
            $pattern = '/^'. $prefix . '(.*)/';
            $matched = preg_match($pattern, $remoteDirectory, $matches);
            if (!$matched) {
                $remoteDirectory = $prefix . $remoteDirectory;
            }

            // TODO: improve this to handle recursive iteration
            $dir = new \FilesystemIterator($localDirectory);
            foreach ($dir as $fileinfo) {
                if ($fileinfo->isFile()) {

                    // upload the files
                    $upload = $this->uploadFile(
                        $localDirectory . DIRECTORY_SEPARATOR .
                            $fileinfo->getFilename(),
                        $remoteDirectory
                    );

                    //$uploaded[] = $upload;
                }
            }

            return $uploaded;

        } else {
            throw new \Exception(
                sprintf('Directory "%s" doesn\'t exist', $localDirectory)
            );
        }

        return false;
    }
}