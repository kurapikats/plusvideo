if (top.shortTail_D30 === undefined) {
    var shortTail_D30 = {};

    // **************************************** //
    // ** BEGIN IMAGE INTERSTITIAL VARIABLES ** //
    // **************************************** //

    shortTail_D30.AD_CONTAINER          = '{VOTP_AD_CONTAINER}';

    shortTail_D30.CDN_CONTAINER_URL     = shortTail_D30.AD_CONTAINER;

    //Ad Image Filename and size
    shortTail_D30.AD_IMAGE_FILENAME     = '{VOTP_AD_IMAGE_FILENAME}';
    shortTail_D30.AD_IMAGE_WIDTH        = '{VOTP_AD_IMAGE_WIDTH}';
    shortTail_D30.AD_IMAGE_HEIGHT       = '{VOTP_AD_IMAGE_HEIGHT}';

    //Ad Click URL
    shortTail_D30.AN_CLICK_URL          = '{VOTP_AD_AN_CLICK_URL}';

    //AppNexus Placement ID
    shortTail_D30.APPNEXUS_PLACEMENT_ID = '{VOTP_AD_AN_PLACEMENT_ID}';

    //Required Viewing Time (Seconds)
    shortTail_D30.AD_REQ_VIEWING_TIME   = '{VOTP_AD_REQ_VIEWING_TIME}';
    //Auto Close Timer (Seconds)
    shortTail_D30.AD_TIMER_AUTO_CLOSE   = '{VOTP_AD_TIMER_AUTO_CLOSE}';
    //Text at top right
    shortTail_D30.AD_TEXT_TOP_RIGHT     = '{VOTP_AD_TEXT_TOP_RIGHT} ';
    //Text at top left
    shortTail_D30.AD_TEXT_TOP_LEFT      = '{VOTP_AD_TEXT_TOP_LEFT}';

    // Modal Opacity
    shortTail_D30.AD_MODAL_ALPHA        = '{VOTP_AD_MODAL_ALPHA}';

    // ************************************** //
    // ** END IMAGE INTERSTITIAL VARIABLES ** //
    // ************************************** //
    //console.log('D30:v.120213:422');

    shortTail_D30.width = shortTail_D30.AD_IMAGE_WIDTH;
    shortTail_D30.height = shortTail_D30.AD_IMAGE_HEIGHT;
    shortTail_D30.modalAlpha = shortTail_D30.AD_MODAL_ALPHA;

    //New variable for AppNexus Server
    shortTail_D30.APPNEXUS_SERVER = 'http://video.adtouch.com/api/vast?size=1d30Swf&autoplay=true&pid=';

    //This needs to be set for the
    shortTail_D30.IS_APPNEXUS_PLAYER_APP = false;

    //The viewing time required before the close button appears
    shortTail_D30.REQUIRED_VIEWING_TIME = shortTail_D30.AD_REQ_VIEWING_TIME;

    //Volume control 10-100
    shortTail_D30.VOLUME_LEVEL = '0.5';

    //Muted true/false
    shortTail_D30.MUTED = 'true';

    shortTail_D30.MODE_WRAPPER = 0;
    shortTail_D30.MODE_INLINE = 1;

    shortTail_D30.URL_SWFOBJECT = 'http://cdn.video.adtouch.com/assets/swfobject.js';
    shortTail_D30.URL_D30 = 'http://cdn.video.adtouch.com/assets/d30.swf';

    /** @@Set by the Player Creator@@ **/
    //shortTail_D30.MODE_WRAPPER or shortTail_D30.MODE_INLINE
    shortTail_D30.PLAYER_MODE = shortTail_D30.MODE_WRAPPER;

    /** @@Set by the player creator@@ **/
    shortTail_D30.AD_SLOT_IMAGE_URL = '';
    shortTail_D30.AD_SLOT_IMAGE_CLICK_THROUGH_URL = '';

    /** @@Set by the Player Creator@@ **/
    shortTail_D30.AD_SLOT_SIZE = '1d30Swf';

    /** @@Set by the Player Creator@@ **/
    //NOTE: tracker URL only used in MODE_WRAPPER
    //NOTE: {ad_id} is replaced with the ad_id in the VAST tag by the d30.swf. DONOT EDIT THE FOLLOWING LINE
    shortTail_D30.ANALYTICS_TRACKER_URL='http://video.adtouch.com/api/tracker?pid='+shortTail_D30.APPNEXUS_PLACEMENT_ID+'&adid={ad_id}&size='+shortTail_D30.AD_SLOT_SIZE+'&';

    shortTail_D30.content = '';
    shortTail_D30.ready = false;
    shortTail_D30.modal = '';
    shortTail_D30.ieFix = false;
    shortTail_D30.version = '04_30_10_0323PM';
    shortTail_D30.useModalAlphaTween = true;
    shortTail_D30.activeTweens = [];
    shortTail_D30.tweenFrameRate = 60;
    shortTail_D30.alphaTweenDuration = 0.3;

    shortTail_D30.log = function(message) {
        if(window.console && window.console.log) {
            window.console.log(message);
        }
    };

    shortTail_D30.embed = function(){
        //shortTail_D30.log('top.document.addEventListener: ' +top.document.addEventListener);
        //shortTail_D30.log('top.document.attachEvent: '+top.document.attachEvent);
        if (top.document.addEventListener) {
            top.document.addEventListener(
                "DOMContentLoaded",
                function(){top.document.removeEventListener("DOMContentLoaded", arguments.callee, false ); top.shortTail_D30.onPageLoaded();},
                false
            );
            window.addEventListener("load",
                function(){window.removeEventListener("DOMContentLoaded", arguments.callee, false); top.shortTail_D30.onPageLoaded();},
                false
            );
        }
        else if (top.document.attachEvent) {
            top.document.attachEvent("onreadystatechange", function(){
                if(top.document.readyState === "complete"){
                    top.document.detachEvent("onreadystatechange", arguments.callee);
                    top.shortTail_D30.onPageLoaded();
                }
            });

            if (top.document.documentElement.doScroll) (function(){
                if(top.shortTail_D30.ready)
                    return;

                try {
                    // If IE is used, use the trick by Diego Perini
                    // http://javascript.nwbox.com/IEContentLoaded/
                    top.document.documentElement.doScroll("left");
                } catch( error ) {
                    setTimeout( arguments.callee, 0 );
                    return;
                }
                // and execute any waiting functions
                top.shortTail_D30.onPageLoaded();
            })();

            top.document.attachEvent("onload", function(){
                top.document.detachEvent("onload", arguments.callee);
                top.shortTail_D30.onPageLoaded();
            });
        }
        (function(){
            top.window.status = top.document.readyState;
            if (top.document.readyState == "complete") {
                top.shortTail_D30.onPageLoaded();
            }
            else {
                setTimeout(arguments.callee, 1000);
            }
        })();
    };


    shortTail_D30.writeScript = function(p_src) {
        var container = top.document.getElementsByTagName("head").length > 0
                        ? top.document.getElementsByTagName("head")[0] : top.document.getElementsByTagName("body")[0];
        var tag = top.document.createElement('script');
        tag.setAttribute('src', p_src);
        tag.setAttribute('type', 'text/javascript');
        tag.setAttribute('language', 'JavaScript');
        container.appendChild(tag);
        void(tag);
    };


    shortTail_D30.start = function() {
        if (!top.swfobject_D30.hasFlashPlayerVersion("9.0.115")) {
            return
        };

        var version = top.shortTail_D30.getInternetExplorerVersion(),
            mode = top.shortTail_D30.getInternetExplorerMode(),
            hostPage = top.location.href ? top.location.href : '',
            hostReferrer = top.document.referrer ? top.document.referrer : '',
            viewWidth = top.shortTail_D30.getViewWidth(),
            viewHeight = top.shortTail_D30.getViewHeight();

        top.shortTail_D30.ieFix = (version < 7.0 || mode == 'BackCompat') ? true : false;

        top.shortTail_D30.width = viewWidth < top.shortTail_D30.width ? viewWidth : top.shortTail_D30.width;
        top.shortTail_D30.height = viewHeight < top.shortTail_D30.height ? viewHeight : top.shortTail_D30.height;

        if (top.document.getElementById('shortTail_D30_modal') == null) {
            var modal = top.shortTail_D30.modal = top.document.createElement('div');
            modal.id = 'shortTail_D30_modal';
            modal.style.top = 0;
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.left = 0;
            modal.style.margin = 0;
            modal.style.opacity = 0.0;
            modal.style.overflow = 'hidden';
            modal.style.filter = 'alpha(opacity=0)';
            modal.style.background = '#000';
            modal.style.position = top.shortTail_D30.ieFix ? 'absolute' : 'fixed';
            top.document.getElementsByTagName("body")[0].appendChild(modal);
        }

        if (top.document.getElementById('shortTail_D30_content') == null) {

            // in px
            var videoWidth  = 1;
            var videoHeight = 1;

            var content = top.shortTail_D30.content = top.document.createElement('div');
            content.id = 'shortTail_D30_content';
            content.style.margin = 0;
            content.style.display = 'block';
            content.style.opacity = 0.0;
            content.style.filter = 'alpha(opacity=0)';
            content.style.width = top.shortTail_D30.width + 'px';
            content.style.height = top.shortTail_D30.height + 'px';
            content.style.position = top.shortTail_D30.ieFix ? 'absolute' : 'fixed';

            var shortTailD30SwfCon = document.createElement('div');
            shortTailD30SwfCon.id = 'shortTail_D30_swf_con';
            shortTailD30SwfCon.style.margin = '50px auto';
            shortTailD30SwfCon.style.width = videoWidth + 'px';

            var shortTailD30Swf = document.createElement('div');
            shortTailD30Swf.id = 'shortTail_D30_swf';

            shortTailD30SwfCon.appendChild(shortTailD30Swf);

            content.appendChild(shortTailD30SwfCon);

            top.document.getElementsByTagName("body")[0].appendChild(content);

            var divImgCon = document.createElement('div');
            divImgCon.id = 'img-con';
            divImgCon.style.position = 'absolute';
            divImgCon.style.width = '100%';
            divImgCon.style.height = '100%';
            //divImgCon.style.backgroundColor = '#f00';
            divImgCon.style.bottom = '10px';
            divImgCon.style.margin = '0 auto';

            var divAdv = document.createElement('div');
            divAdv.id = 'advertisement';
            divAdv.style.width = '90px';
            divAdv.style.textAlign = 'center';
            divAdv.style.margin = '0 auto';
            divAdv.style.color = '#fff';
            divAdv.style.fontFamily = 'Arial';
            divAdv.style.fontSize = '14px';
            divAdv.style.marginLeft = '5px';
            divAdv.style.position = 'relative';
            divAdv.innerHTML = shortTail_D30.AD_TEXT_TOP_LEFT;

            divImgCon.appendChild(divAdv);

            //box closer
            var aLinkCloser = document.createElement('div');
            aLinkCloser.id = 'd30-closer';
            aLinkCloser.style.display = 'block';
            aLinkCloser.style.marginRight = '5px';
            aLinkCloser.style.textAlign = 'center';
            aLinkCloser.style.textDecoration = 'none';
            aLinkCloser.style.zIndex = 1000;
            aLinkCloser.style.position = 'absolute';
            aLinkCloser.style.right = '-5px';
            aLinkCloser.style.width = '16px';
            aLinkCloser.style.height = '16px';
            aLinkCloser.style.top = '-2px';
            aLinkCloser.style.fontSize = '11px';
            aLinkCloser.style.fontFamily = 'Arial';
            aLinkCloser.style.color = '#fff';
            aLinkCloser.style.border = '1px solid #fff';
            aLinkCloser.innerHTML = 'x';

            aLinkCloser.onmouseover = function() {
                this.style.cursor = 'pointer';
            };

            if (shortTail_D30.AD_REQ_VIEWING_TIME > 0) {

                aLinkCloser.style.color = '#aaa';
                aLinkCloser.style.border = '1px solid #aaa';
                aLinkCloser.onmouseover = function() {
                    this.style.cursor = 'default';
                };

                setTimeout(function() {
                    aLinkCloser.style.color = '#fff';
                    aLinkCloser.style.border = '1px solid #fff';

                    aLinkCloser.onclick=function() {
                        top.shortTail_D30.closeModal();
                    };

                    aLinkCloser.onmouseover = function() {
                        this.style.cursor = 'pointer';
                    };
                }, (shortTail_D30.AD_REQ_VIEWING_TIME + 2) * 1000);

            } else {
                aLinkCloser.onclick=function() {
                    top.shortTail_D30.closeModal();
                };
            }

            divImgCon.appendChild(aLinkCloser);

            var closerText = document.createElement('div');
            closerText.id = 'd30-closer-text';
            closerText.style.marginRight = '25px';
            closerText.style.fontFamily = 'Arial';
            closerText.style.fontSize = '14px';
            closerText.style.color = '#fff';
            closerText.style.position = 'absolute';
            closerText.style.right = '0px';
            closerText.style.top = '0px';
            closerText.innerHTML = shortTail_D30.AD_TEXT_TOP_RIGHT;

            var d30Timer = document.createElement('span');
            d30Timer.id = 'd30-timer';
            d30Timer.innerHTML = shortTail_D30.AD_TIMER_AUTO_CLOSE;

            closerText.appendChild(d30Timer);

            divImgCon.appendChild(closerText);

            var pCon = document.createElement('p');
            pCon.style.textAlign = 'center';
            pCon.style.clear = 'both';
            pCon.style.marginTop = '1px';

            var mainImg = document.createElement('img');
            mainImg.src = shortTail_D30.AD_IMAGE_FILENAME;
            mainImg.width = shortTail_D30.width;
            mainImg.height = shortTail_D30.height;
            mainImg.onmouseover = function() {
                this.style.cursor = 'pointer';
            };
            mainImg.onclick=function() {
                window.open(shortTail_D30.AN_CLICK_URL);
            };

            pCon.appendChild(mainImg);

            divImgCon.appendChild(pCon);

            var d30SwfCon = top.document.getElementById("shortTail_D30_swf_con");
            d30SwfCon.parentNode.insertBefore(divImgCon, d30SwfCon);

            /*if (top.shortTail_D30.ready === true) {
                var count=18;

                function timer() {
                    count=count-1;
                    if (count <= 0) {
                        clearInterval(counter);
                        //counter ended, do something here
                        top.shortTail_D30.closeModal();
                        return;
                    }

                    //Do code for showing the number of seconds here
                    if (count < 15) {
                        d30Timer.innerHTML = count;
                    } else {
                        d30Timer.innerHTML = 15;
                    }
                }

                var counter=setInterval(timer, 1000); //run it every 1 second
            }*/

        }

        top.swfobject_D30.embedSWF( top.shortTail_D30.URL_D30,
                                    "shortTail_D30_swf",
                                    videoWidth,
                                    videoHeight,
                                    "9.0.115",
                                    "expressInstall.swf",
                                    {
                                        hostPage:escape(hostPage),
                                        hostReferrer:escape(hostReferrer),
                                        VastXML:escape(top.shortTail_D30.vastXML)
                                    },
                                    {
                                        bgcolor:"#000000",
                                        allowScriptAccess:"always",
                                        wmode:"transparent"
                                    });
        top.shortTail_D30.onResized();
        top.shortTail_D30.processTimer = setInterval(function(){
                        top.shortTail_D30.setVisibilityForConflictElements(false);
                    }, 250);
    };


    shortTail_D30.showModal = function () {
        if (top.window.addEventListener) {
            top.window.addEventListener('resize', top.shortTail_D30.onResized, false);
        } else if (top.window.attachEvent ) {
            top.window.attachEvent('onresize', top.shortTail_D30.onResized);
            if (top.shortTail_D30.ieFix) {
                top.window.attachEvent('onscroll', top.shortTail_D30.onScroll);
            }
        }
        if (top.shortTail_D30.useModalAlphaTween) {
            top.shortTail_D30.addAlphaTween(top.shortTail_D30.modal.style,
                                            top.shortTail_D30.modalAlpha,
                                            top.shortTail_D30.alphaTweenDuration,
                                            function(){});
        }
        else {
            top.shortTail_D30.modal.style.opacity = top.shortTail_D30.modalAlpha;
            top.shortTail_D30.modal.style.filter = 'alpha(opacity=' + top.shortTail_D30.modalAlpha * 100 + ')';
            top.shortTail_D30.onResized();
        }
        top.shortTail_D30.modal.style.zIndex = 2147483647;
        top.shortTail_D30.content.style.zIndex = 2147483647;

        setTimeout(function(){

            //begin timer
            var d30Timer = document.getElementById('d30-timer');
            var count = shortTail_D30.AD_TIMER_AUTO_CLOSE;
            function timer() {
                count = count-1;
                if (count <= 0) {
                    clearInterval(counter);
                    //counter ended, do something here
                    top.shortTail_D30.closeModal();
                    return;
                }
                d30Timer.innerHTML = count;
            }
            var counter=setInterval(timer, 1000); //run it every 1 second
            //end timer

            top.shortTail_D30.addAlphaTween(top.shortTail_D30.content.style,
                                            1,
                                            top.shortTail_D30.alphaTweenDuration,
                                            function(){});
        }, 1000);
    };


    shortTail_D30.clear = function() {
        var content = top.shortTail_D30.content;
            content.innerHTML = "";
        content.style.width = '1px';
        content.style.height = '1px';
    };


    shortTail_D30.closeModal = function () {
        if (top.shortTail_D30.useModalAlphaTween) {
            top.shortTail_D30.addAlphaTween(top.shortTail_D30.modal.style,
                                            0.0,
                                            top.shortTail_D30.alphaTweenDuration,
                                            function(){
                                                top.shortTail_D30.closeModalAfterTween();
                                            });
        }
        else {
            top.shortTail_D30.closeModalAfterTween();
        }

        top.shortTail_D30.addAlphaTween(top.shortTail_D30.content.style,
                                        0.0,
                                        top.shortTail_D30.alphaTweenDuration,
                                        function(){});
    };


    shortTail_D30.closeModalAfterTween = function () {
        top.shortTail_D30.modal.style.display = 'none';
        top.shortTail_D30.modal.innerHTML = '';
        top.shortTail_D30.content.style.display = 'none';

        if (top.window.removeEventListener) {
            top.window.removeEventListener('resize', top.shortTail_D30.onResized, false);
        } else if (top.window.removeEvent) {
            top.window.removeEvent('onresize', top.shortTail_D30.onResized);
            if (top.shortTail_D30.ieFix){
                top.window.removeEvent('onscroll', top.shortTail_D30.onScroll);
            }
        }

        // SAFARI throws an error if attempting to kill out from an ExternalInterface call
        setTimeout("top.shortTail_D30.clear();", 250);
        try {
            top.shortTail_D30_onClose();
        } catch(e) {
            //throw away expection???
        }
        clearInterval(top.shortTail_D30.processTimer);
        top.shortTail_D30.setVisibilityForConflictElements(true);
    };


    shortTail_D30.setVisibilityForConflictElements = function(p_visible) {
        var d = top.document,
            element,
            elements,
            elementItr,
            tag,
            tags = ["SELECT", "INPUT", "IFRAME", "OBJECT", "EMBED"],
            tagItr = tags.length,
            visibility = p_visible ? "visible" : "hidden";

        while(tagItr--) {
            tag = tags[tagItr];
            elements = d.getElementsByTagName(tag);
            elementItr = elements.length;
            while (elementItr--) {
                element = elements[elementItr];
                if (((!p_visible) &&
                    (element.style.visibility == visibility) &&
                    element.getAttribute("d30Tagged")) != 1) {

                    element.setAttribute("previouslyHidden", "1");
                }
                element.setAttribute("d30Tagged", "1");
                if (element.getAttribute("previouslyHidden") != 1) {
                    if(
                        (tag == "SELECT")||
                        ((tag == "INPUT")&&(element.type=="text"))||
                        ((tag =="IFRAME"))||
                        (((tag=="OBJECT")||(tag=="EMBED")) && (element.id.indexOf("shortTail_D30") == -1))) {
                            element.style.visibility = visibility;
                    }
                }
            }
        }
    };


    shortTail_D30.onPageLoaded = function() {
        if(top.shortTail_D30.ready) return;

        top.shortTail_D30.ready = true;

        if (top.swfobject_D30 == undefined){
            top.shortTail_D30.writeScript(top.shortTail_D30.URL_SWFOBJECT);
        }

        top.shortTail_D30.initTimer = setInterval(function() {
            if (top.swfobject_D30 != undefined) {
                clearInterval(top.shortTail_D30.initTimer);

                top.shortTail_D30.start();
            }
        }, 100);
    };


    shortTail_D30.onVPAIDEvent = function(p_event){
        try {
            top.shortTail_D30_onVPAIDEvent(p_event);
        } catch(e) {
            //throw away exception???
        }
    };

    shortTail_D30.onResized = function() {
        var viewWidth = top.shortTail_D30.getViewWidth(),
            viewHeight = top.shortTail_D30.getViewHeight();

        top.shortTail_D30.content.style.left = Math.round((viewWidth - top.shortTail_D30.width) / 2) + 'px';

        if (top.shortTail_D30.ieFix) {
            top.shortTail_D30.content.style.top = Math.round(((viewHeight - top.shortTail_D30.height) / 2) + top.document.documentElement.scrollTop) + 'px';
            top.shortTail_D30.modal.style.top = top.document.documentElement.scrollTop;
            top.shortTail_D30.modal.style.height = viewHeight + 20;
        }
        else {
            top.shortTail_D30.content.style.top = Math.round((viewHeight - top.shortTail_D30.height) / 2) + 'px';
        }
    };

    shortTail_D30.getViewWidth = function() {
        if (typeof top.window.innerWidth != 'undefined') {
            return top.window.innerWidth;
        } else if (typeof top.document.documentElement != 'undefined' &&
                   typeof top.document.documentElement.clientWidth != 'undefined' &&
                   top.document.documentElement.clientWidth != 0) {

            return top.document.documentElement.clientWidth;
        } else {
            return top.document.getElementsByTagName('body')[0].clientWidth;
        }
        return 0;
    };


    shortTail_D30.getViewHeight = function() {
        if (typeof top.window.innerWidth != 'undefined') {
            return top.window.innerHeight;
        } else if (typeof top.document.documentElement != 'undefined' &&
                   typeof top.document.documentElement.clientWidth != 'undefined' &&
                   top.document.documentElement.clientWidth != 0) {

            return top.document.documentElement.clientHeight;
        } else {
            return top.document.getElementsByTagName('body')[0].clientHeight;
        }
        return 0;
    };


    shortTail_D30.onScroll = function() {
            top.shortTail_D30.content.style.top = Math.round(((top.document.documentElement.clientHeight - top.shortTail_D30.height) / 2) + top.document.documentElement.scrollTop) + 'px';
            top.shortTail_D30.modal.style.top = top.document.documentElement.scrollTop;
    };


    shortTail_D30.getInternetExplorerVersion = function() {
        var rv = 99999;
        if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat( RegExp.$1 );
        }
        return rv;
    };


    shortTail_D30.getInternetExplorerMode = function() {
        var mode = '';
        if (navigator.appName == 'Microsoft Internet Explorer'){
            mode = top.document.compatMode;
        }
        return mode;
    };


    shortTail_D30.tweenLoop = function() {
        var now = (new Date() - 0);
        for (var i = 0; i < top.shortTail_D30.activeTweens.length; i++) {
            var tween = top.shortTail_D30.activeTweens[i],
                start = now - tween.startTime,
                delta = tween.endTime - tween.startTime;
            if (start >= delta) {
                var val = tween.b + tween.c;
                tween.target.opacity = val;
                tween.target.filter = 'alpha(opacity = ' + (val*100) + ')';
                top.shortTail_D30.activeTweens.splice(i,1);
                if (typeof tween.onComplete == 'function') {
                    tween.onComplete();
                }
            }
            else {
                var val = tween.c*start/delta + tween.b;
                try {
                    // FIXME: IE sometimes throws error...
                    tween.target.opacity = val;
                    tween.target.filter = 'alpha(opacity = ' + (val*100) + ')';
                } catch(e) {}
            }
        }
        if (top.shortTail_D30.activeTweens.length > 0) {
            setTimeout( function() {
                            top.shortTail_D30.tweenLoop();
                        },
                        1000/top.shortTail_D30.tweenFrameRate);
        }
    };


    shortTail_D30.addAlphaTween = function(p_obj, p_val, p_dur, p_func) {
        var tween = {};
        tween.target = p_obj;

        // hardcode current alpha to avoid having
        // to hack out code for getting opacity in ie.
        // can use p_obj.opacity in other browsers
        tween.b = p_val <= 0 ? top.shortTail_D30.modalAlpha : 0;

        tween.c = p_val - tween.b;
        tween.duration = p_dur;
        tween.onComplete = p_func;
        tween.startTime = (new Date() - 0);
        tween.endTime = tween.duration * 1000 + tween.startTime;

        top.shortTail_D30.activeTweens[top.shortTail_D30.activeTweens.length] = tween;
        if (top.shortTail_D30.activeTweens.length == 1) {
            top.shortTail_D30.tweenLoop();
        }
    };

    top.shortTail_D30 = shortTail_D30;

    /**
     * Function to load the VAST XML from a URL
     * @author Ram
     */
    shortTail_D30.loadXHR = function (url){
        //reset the vastXMl variable
        shortTail_D30.vastXML = '<vast />';
        if(typeof ADGENT_APPNEXUS_PREVIEW_MODE !== 'undefined'){
            url=url+'&preview=true';
        }
        //shortTail_D30.log('D30 APP: RAM: URL='+url);
        var xmlhttp;
        if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp=new XMLHttpRequest();
        }else{// code for IE6, IE5
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function(){
            shortTail_D30.handleResponse(xmlhttp);
        }
        //url = 'http://ib.adnxs.com/ttj?id=839276&size=300x600';
        xmlhttp.open("GET",url,true);
        xmlhttp.send('');
    }

    /**
     * Function to set cookie header
     * @param  {[string]} name  [name]
     * @param  {[string]} value [value]
     * @param  {[integer]} days  [days]
     * @return {[string]}
     */
    shortTail_D30.setCookie = function(name,value,days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
        }
        else var expires = "";
        document.cookie = name+"="+value+expires+"; path=/";
    }

    /**
     * Function in getting cookie
     * @param  {[string]} name [cookie name]
     * @return {[string]}
     */
    shortTail_D30.getCookie = function(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    /**
     * Function to load handle the response of the server
     * @author Ram
     * @todo Change shortTail_D30.log to trackEvent
     */
    shortTail_D30.handleResponse = function(xmlhttp){
        /*if( xmlhttp.readyState == 0 ) {
            shortTail_D30.log("UNITIALIZED");
        }
        else if( xmlhttp.readyState == 1 ) {
            shortTail_D30.log("LOADING");
        }
        else if( xmlhttp.readyState == 2 ) {
            shortTail_D30.log("LOADED");
        }
        else if( xmlhttp.readyState == 3 ) {
            shortTail_D30.log("INTERACTIVE");
        }
        else */
        if( xmlhttp.readyState == 4 ) {
            shortTail_D30.log("COMPLETE");
            if( xmlhttp.status == 200 ) {
                apiResponseHeader = xmlhttp.getResponseHeader('x-adgent-Set-Cookie');

                // shortTail_D30.setCdnDomainCookie(cdn_url, apiResponseHeader);
                shortTail_D30.setCdnDomainCookie(apiResponseHeader);

                shortTail_D30.log('D30 APP: RAM: responseText='+xmlhttp.responseText);
                //shortTail_D30.log('D30 APP: RAM: responseXML='+xmlhttp.responseXML);
                shortTail_D30.vastXML = xmlhttp.responseText;
                var regex = new RegExp('\<vast\\s?\/\>','im');
                if(!regex.test(shortTail_D30.vastXML)){
                    shortTail_D30.embed();
                }
            }
        }
    }

    /**
     * Function to set cookie on cdn.video.adtouch.com
     * @param  {string} cookieString consist of sess, icu, anj cookie names
     * @return {[type]}              [description]
     */
    shortTail_D30.setCdnDomainCookie = function (cookieString) {
        shortTail_D30.log(cookieString);
        var pattern;
        var index;
        var keys    = ["uuid2","sess", "icu", "anj"];
        var result  = [];
        var matched;

        if(cookieString) {
            for(index=0; index < keys.length; index++) {
                keyIndex    = keys[index];
                pattern     = keyIndex+'=([^;]*);';
                var regex   = new RegExp(pattern);

                matched = cookieString.match(regex);
                if (matched && matched !== null){
                    result[keyIndex] = matched[1];
                    shortTail_D30.setCookie(keyIndex,result[keyIndex]);
                    shortTail_D30.log('Get Cookie: ' + keyIndex + '=' + shortTail_D30.getCookie(keyIndex));
                }

            }
        }
        return result;
    }
/*
//I think this is the wrong approach;
//this function will do an asynchronous ajax call to index.html
//upon success cookies are now set using firebug console
    shortTail_D30.setCdnDomainCookie = function (url, cookies) {
        var request = new XMLHttpRequest();

        request.onreadystatechange = function () {
            if (request.readyState==4) {// 4 = "loaded"
                if (request.status==200) {// 200 = OK
                    shortTail_D30.log('Setting of Cookies to '+url+' is successful');
                    shortTail_D30.log(request.getAllResponseHeaders());
                }
                else {
                    shortTail_D30.log('problem retrieving ' + url);
                }
            }
        }

        request.open("GET", url, true);
        // request.setRequestHeader("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8");
        request.setRequestHeader("Accept","text/plain");
        request.setRequestHeader("Content-Type","text/html");
        request.setRequestHeader("x-adgent-Set-Cookie", cookies);

        request.send(null);

    }
*/

    /**
     * Function to launch the D30 player.
     * Decides whether the embedded VAST xml should be used or the one that is
     * loaded fromt the XHR
     * @author Ram
     */
    shortTail_D30.launchPlayer = function (){
        if(shortTail_D30.AD_SLOT_SIZE!='1d30Swf'){
            if(shortTail_D30.AD_SLOT_IMAGE_URL !=''){
                if(shortTail_D30.AD_SLOT_IMAGE_CLICK_THROUGH_URL != ''){
                    document.write('<a href="'+shortTail_D30.AD_SLOT_IMAGE_CLICK_THROUGH_URL+'" target=_blank><img src="'+shortTail_D30.AD_SLOT_IMAGE_URL+'" border=0></a>');
                }else{
                    document.write('<img src="'+shortTail_D30.AD_SLOT_IMAGE_URL+'" border=0>');
                }
            }
        }
        if(shortTail_D30.IS_APPNEXUS_PLAYER_APP){
            shortTail_D30.log('shortTail_D30.IS_APPNEXUS_PLAYER_APP: '+ shortTail_D30.IS_APPNEXUS_PLAYER_APP);
            shortTail_D30.log('shortTail_D30.PLAYER_MODE: '+ shortTail_D30.PLAYER_MODE);
            switch(shortTail_D30.PLAYER_MODE){
                case shortTail_D30.MODE_INLINE:
                    //retreive the VAST XML from backend servers
                    var url = shortTail_D30.APPNEXUS_SERVER + shortTail_D30.APPNEXUS_PLACEMENT_ID +
                                '&opacity='+ shortTail_D30.modalAlpha +
                                '&time='+ shortTail_D30.REQUIRED_VIEWING_TIME +
                                '&muted='+shortTail_D30.MUTED +
                                '&volume='+shortTail_D30.VOLUME_LEVEL;
                    shortTail_D30.loadXHR(url);
                    break;
                case shortTail_D30.MODE_WRAPPER:
                    shortTail_D30.log(shortTail_D30.vastXML);
                    //VAST Tag is embedded .. so just launch it
                    shortTail_D30.embed();
                    break;
                default:
                    shortTail_D30.log("Error: Unknow Mode. Could not launch player");
            }
        }else{
            // ok normal loading .. just launch the player
            shortTail_D30.embed();
        }
    };

    //the code below invokes the click tracker
    shortTail_D30.trackThirdParty = function(tracker) {
      if (tracker) {
        var image = new Image();
        image.src = pubclick;
      }
    }
    /*
     * The VASTXML string var that is passed into the constructor as VAST string
     * Ad servers should template this string so that it creates a valid VAST document within the one line string.
     * The D30 JavaScript will the embed the VAST string into the D30 Flash module when the ad is run.
     */
     /**@@ VAST is empty here we call api/vast to retrieve the VAST tag @@ */
    shortTail_D30.vastXML= '<?xml version="1.0" encoding="UTF-8"?><VAST version="2.0"><Ad><InLine><Creatives><Creative><Linear/></Creative></Creatives><Extensions><Extension type="D30Config"><VMEnabled>false</VMEnabled></Extension></Extensions></InLine></Ad></VAST>';
    //Launch the player after processing the options
    shortTail_D30.launchPlayer();
    //Track the impression
    shortTail_D30.trackThirdParty(shortTail_D30.THIRD_PARTY_TRACKING_URL);
};
