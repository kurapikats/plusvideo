<?php
namespace VideoOtp\PlusVideo;

use VideoOtp\S3Uploader;

require_once 'S3Uploader.php';

class PlusVideo
{
    public function __constructor()
    {

    }

    public function processJs($jsFile)
    {
        echo $jsFile;

        $access = array(
            'key'    => 'XXX',
            'secret' => 'XXX',
        );
        $x = new S3Uploader($access, 'video-d30');
        $upload = $x->uploadDirectory(__DIR__);

        // prepend 'a-' for easy browsing on aws console
        var_dump($upload);
        exit;

    }
}

