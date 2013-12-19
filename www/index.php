<?php
namespace VideoOtp\PlusVideo;

require_once '../PlusVideo.php';

if (isset($_POST['upload'])
    && ($_POST['upload'] == true &&
    !empty($_FILES['user_settings']['tmp_name']))) {

    $uploadDir = 'uploads/';
    $userConfigFile = $_FILES['user_settings']['name'] . '-' . date('mdy-his');
    $userSettings = $uploadDir . $userConfigFile;

    // move user config file to uploads directory
    move_uploaded_file($_FILES["user_settings"]["tmp_name"], $userSettings);

    $votp = new PlusVideo($userSettings);

    // if success file upload, move the image to creatives directory
    if ($_FILES['ad_image']['error'] == 0 && $_FILES['ad_image']['size'] > 0) {
        $this->renameUploadedFile($_FILES);
    }

    // should we upload to cdn (production)?
    $upload = (isset($_POST['production'])?$_POST['production']:"false");

    $uploadResult = $votp->processJs($upload);
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
