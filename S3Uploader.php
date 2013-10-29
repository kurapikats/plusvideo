<?php
namespace VideoOtp\S3Uploader;

use Aws\S3\S3Client;

require_once 'libraries' . DIRECTORY_SEPARATOR . 'aws.phar';

class S3Uploader {

    private $client;
    private $bucket;

    /**
     * Pass the amazon access key/secret
     * $access['key']
     * $access['secret']
     * @param array  $access Amazon access credentials
     * @param string $bucket S3 bucket name
     */
    public function __construct(array $access = array(), $bucket = 'video-d30')
    {
        // TODO: add checking here
        $this->client = S3Client::factory(array(
            'key' => $access['key'],
            'secret' => $access['secret'],
        ));

        $this->bucket = $bucket;

        $this->client->registerStreamWrapper();
    }

    /**
     * Upload a file on S3, if the file exist backup the old file
     * and append timestamp on the filename
     *
     * @param  string $filename        local file to be uploaded,
     *                                 relative or absolute file
     * @param  string $remoteDirectory Remote directory where to upload the file
     * @param  string $prefix          Defaults to "a-", this is to make
     *                                 browsing on S3 console easier
     * @return string url              Returns the generated S3 url
     */
    public function uploadFile($filename, $remoteDirectory = "", $prefix = "a-")
    {
        if (file_exists($filename)) {

            // use this as remote filename,
            $basename = pathinfo($filename)['basename'];

            if (!empty($remoteDirectory)) {
                $key = str_replace('/', '', $remoteDirectory) . '/' .
                    $prefix . $basename;
            } else {
                $key = $prefix . $basename;
            }

            try {
                $s3Url = 's3://' . $this->bucket . '/';

                // if it already exist on the bucket rename it
                if (file_exists($s3Url . $key)) {
                    $newName = $key . '-' . date('mdy-His');
                    rename($s3Url . $key, $s3Url . $newName);
                }

                // Upload an object to Amazon S3
                $result = $this->client->putObject(array(
                    'Bucket' => $this->bucket,
                    'Key' => $key,
                    'SourceFile' => $filename,
                ));

                return $result['ObjectURL'];

            } catch (\Exception $e) {
                throw new \Exception($e->getMessage());
            }
        } else {
            throw new \Exception(sprintf('File "%s" doesn\'t exist',
                $filename));
        }

        return false;
    }

    /**
     * Upload a directory to S3
     * ie. uploading D:\projects\sandbox\video-otp
     * will use 'video-otp' as it's remote directory
     * @param  string $localDirectory Target directory to upload
     * @param  string $prefix         Defaults to "a-", this is to make
     *                                browsing on S3 console easier
     */
    public function uploadDirectory($localDirectory, $prefix = "a-")
    {
        if (file_exists($localDirectory) && is_dir($localDirectory)) {

            // use the current directory as remote directory
            $path = explode(DIRECTORY_SEPARATOR, $localDirectory);
            $remoteDirectory = end($path);

            // TODO: improve this to handle recursive iteration
            $dir = new \FilesystemIterator($localDirectory);
            foreach ($dir as $fileinfo) {
                if ($fileinfo->isFile()) {
                    // upload the files
                    $upload = $this->uploadFile($fileinfo->getFilename(),
                        $prefix . $remoteDirectory);

                    echo $upload . "\n";
                }
            }

        } else {
            throw new \Exception(sprintf('Directory "%s" doesn\'t exist',
                $localDirectory));
        }
    }
}