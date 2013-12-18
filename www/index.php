<?php
namespace VideoOtp\PlusVideo;

require_once '../PlusVideo.php';

if (isset($_POST['upload'])
    && ($_POST['upload'] == true &&
    !empty($_FILES['user_settings']['tmp_name']))) {

    $uploadDir = 'uploads/';
    $userConfigFile = $_FILES['user_settings']['name'] . '-' . date('mdy-his');

    // move user config file to uploads directory
    move_uploaded_file($_FILES["user_settings"]["tmp_name"],
        $uploadDir . $userConfigFile);

    $userSettings = $uploadDir . $userConfigFile;
    $usrConf = parse_ini_file($userSettings);

    // get the appropriate default config file
    $defaultSettings = '../templates/settings.' . $usrConf['VOTP_AD_TYPE'] .
        '.defaults.conf';

    $votp = new PlusVideo($userSettings, $defaultSettings);

    $pathAndUrl = $votp->getPathAndUrl();

    $jsTemplate = '..' . DIRECTORY_SEPARATOR . 'templates' .
        DIRECTORY_SEPARATOR . $usrConf['VOTP_AD_TYPE'] . '.js';

    $localCreativeDir = $pathAndUrl['localCreativeDir'] . DIRECTORY_SEPARATOR;

    $jsOutFile = $localCreativeDir . 'd30_player.js';

    // TODO: VAST specific?
    // move the logo to creatives directory
    if ($_FILES['ad_image']['error'] == 0 &&
        $_FILES['ad_image']['size'] > 0) {

        if (isset($pathAndUrl['logoFilename'])) {
            $filename = $pathAndUrl['logoFilename'];
        } else {
            $filename = $_FILES['ad_image']['name'];
        }

        $fileUri = $localCreativeDir . $filename;
        move_uploaded_file($_FILES['ad_image']['tmp_name'], $fileUri);
    } else {
        //use the 1x1 gif
        $img1x1 = __DIR__ . '/../assets/1x1.gif';
        copy($img1x1, $localCreativeDir . $pathAndUrl['logoFilename']);
    }

    $defConf = parse_ini_file($defaultSettings);

    // TODO: VAST specific?
    // rename the uploaded logo based on the filename on the user config file
    // if the user uploaded a logo  and didn't specify a filename on the config
    // use the default logo filename from default config variable
    if ($usrConf['VOTP_AD_TYPE'] == 'vast') {
        if (isset($usrConf['VOTP_AD_SPONSOR_LOGO']) &&
            !empty($usrConf['VOTP_AD_SPONSOR_LOGO'])) {
            $newLogoFilename = $localCreativeDir . $usrConf['VOTP_AD_SPONSOR_LOGO'];
        } else {
            $newLogoFilename = $localCreativeDir . $defConf['VOTP_AD_SPONSOR_LOGO'];
        }
    } else {
        // use filename from image conf file
        $newLogoFilename = $localCreativeDir . $defConf['VOTP_AD_IMAGE_FILENAME'];
    }

    //var_dump($_FILES['ad_image']['name'], $defConf['VOTP_AD_IMAGE_FILENAME']);
    //var_dump($logoFilename, $newLogoFilename)
    //exit;

    // TODO: VAST specific?
    if (!empty($_FILES['ad_image']['name'])) {
        rename($fileUri, $newLogoFilename);
    }

    if (!isset($_POST['production'])) {
        $upload = "false";
    } else {
        $upload = $_POST['production'];
    }

    $uploadResult = $votp->processJs($jsTemplate, $jsOutFile, $upload);
}

?>
<!DOCTYPE html>
<html>
  <head>
    <title>VOTP</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <!-- Bootstrap -->
    <link href="assets/css/bootstrap.min.css" rel="stylesheet">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media
        queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js">
        </script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js">
        </script>
    <![endif]-->
  </head>
  <body>

    <div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse"
            data-target=".navbar-collapse">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="index.php">VOTP</a>
        </div>
        <div class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
            <li class="active"><a href="index.php">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </div>

    <div class="container">

        <div id="votp" style="margin-top:80px;">
            <h4>1. Download Configuration</h4>
            <ul>
                <li><a href="settings/settings.vast.user.conf" target="_blank">
                    Vast Template Configuration</a></li>
                <li><a href="settings/settings.image.user.conf" target="_blank">
                    Interstitial Image Template Configuration</a></li>
            </ul>

            <form method="post" enctype="multipart/form-data"
                action="index.php">

                <h4>2. After download, modify the config file.</h4>

                <input type="file" name="user_settings" id="user_settings">

                <h4>3. Upload image</h4>
                <input type="file" name="ad_image" id="ad_image">

                <h4>4. Select where to upload.</h4>
                <input type="radio" name="production" value="false">
                    Local Server (Testing)<br>
                <input type="radio" name="production" value="true">
                    Production Server (CDN)<br>

                <input type="hidden" name="upload" value="true">
                <input type="hidden" name="template" value="vast">
                <h4>5. Upload to Server</h4>
                <input type="submit" name="btn_submit" value="Upload">
            </form>

            <?php
                if (isset($uploadResult) && !empty($uploadResult)) {
                    echo "<br><ul>";
                    foreach ($uploadResult as $k => $v) {
                        echo "<li>{$k}: <strong><a href='{$v}' target='_blank'>
                            {$v}</a></strong></li>";
                    }
                    echo "</ul>";
                }
            ?>
        </div>

    </div><!-- /.container -->

    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://code.jquery.com/jquery.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as
        needed -->
    <script src="assets/js/bootstrap.min.js"></script>
  </body>
</html>
