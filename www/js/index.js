// index.js

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    removeWhite(can){
        
    }
    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        // Method below REQUIRES elements we removed from body in index.html
        // So we comment it out.
        // this.receivedEvent('deviceready');

        let options = {
            x: 0,
            y: 0,
            width: window.screen.width,
            height: window.screen.height,
            camera: CameraPreview.CAMERA_DIRECTION.BACK,  // Front/back camera
            toBack: true,   // Set to true if you want your html in front of your preview
            tapPhoto: false,  // Tap to take photo
            tapFocus: true,   // Tap to focus
            previewDrag: false
        };

        var flash_mode = 'off';
        // Take a look at docs: https://github.com/cordova-plugin-camera-preview/cordova-plugin-camera-preview#methods
        

        // Create a rectangle & buttons
        var rect = document.createElement('div');
        var take_pic_btn = document.createElement('img');
        var flash_on_btn = document.createElement('img');
        var flash_off_btn = document.createElement('img');

        var oldImg = document.createElement('img');
        var newImg = document.createElement('canvas');
        var takenImg = document.createElement('img');

        // You must specify path relative to www folder
        take_pic_btn.src = 'img/take_photo.png';
        flash_on_btn.src = 'img/flash_on.svg';
        flash_off_btn.src = 'img/flash_off.svg';

        // Add styles
        rect.className += 'rect_class';
        take_pic_btn.className += ' take_pic_class'
        flash_on_btn.className += ' flash_class'
        flash_off_btn.className += ' flash_class'


        oldImg.className = 'imagePreview';
        newImg.className = 'imagePreviewCaneview';
        takenImg.className = 'imagePreview';
        oldImg.id = 'originalPicture';
        newImg.id = 'previewPicture';
        takenImg.id = 'takenPicture';

        newImg.height = window.screen.height;
        newImg.width = window.screen.width;
        // Hide flash_off btn by default
        flash_off_btn.style.visibility = 'hidden';

        // Append to body section
        document.body.appendChild(rect);
        document.body.appendChild(take_pic_btn);
        document.body.appendChild(flash_on_btn);
        document.body.appendChild(newImg);
        document.body.appendChild(oldImg);
        document.body.appendChild(takenImg);


        // Get rectangle coordinates
        var rect_coords = rect.getBoundingClientRect();
        var x_coord = rect_coords.left, y_coord = rect_coords.top;

        take_pic_btn.onclick = function(){
            // Get rectangle size
            var rect_width = rect.offsetWidth, rect_height = rect.offsetHeight;

            CameraPreview.takePicture(
                {
                    width:window.screen.width, 
                    height:window.screen.height, 
                    quality: 20, 
                    shutterSound: false,
                    saveToPhotoGallery: false,  
                },
                function(base64PictureData){
                    document.getElementById('originalPicture').src = "data:image/jpeg;base64," +base64PictureData;

                    image = new MarvinImage();
                    function imageLoaded(){
                      var imageOut = new MarvinImage(window.screen.width,  window.screen.height);
                      for (var i = 0; i < window.screen.width; i++) {
                        for (var j = 0; j < window.screen.height; j++) {
                            image.setAlphaComponent(i, j, 0); 
                        }
                      }
                      // Edge Detection (Prewitt approach)
                      Marvin.prewitt(image, imageOut);
                      // Invert color
                      Marvin.invertColors(imageOut, imageOut);
                      // Threshold
                      Marvin.thresholding(imageOut, imageOut, 100);
                      imageOut.draw(newImg);
                      var ctx = newImg.getContext("2d");
                        var contain = function(i,j){
                            var x = 200;
                            var y = 200;
                            var h = 100;
                            var w = 100;
                            if(i >= x && i <= x+w){
                                if(j >= y && j <= y+h){
                                    return true;
                                }
                            }
                            return false;
                        };
                        var imgData = ctx.createImageData(1, 1);
                        for (var i = 0; i <  window.screen.width; i++) {
                           for (var j = 0; j <  window.screen.height; j++) {
                                var tmp = ctx.getImageData(i,j,1,1); 
                                if( (tmp.data[0] == 255 && tmp.data[1] == 255 && tmp.data[2] == 255 )  ){
                                    imgData.data[0] = 255;
                                    imgData.data[1] = 0;
                                    imgData.data[2] = 0;
                                    imgData.data[3] = 0;
                                    ctx.putImageData(imgData, i, j);
                                }
                            }
                        } 
                    }
                    image.load("data:image/jpeg;base64," +base64PictureData, imageLoaded);


                }
            );
        };

        flash_on_btn.onclick = function() {
            flash_mode = 'on';
            flash_off_btn.style.visibility = 'visible';
            flash_on_btn.style.visibility = 'hidden';

            CameraPreview.setFlashMode(flash_mode);
        }

        flash_off_btn.onclick = function() {
            flash_mode = 'off';
            flash_off_btn.style.visibility = 'hidden';
            flash_on_btn.style.visibility = 'visible';

            CameraPreview.setFlashMode(flash_mode);
        }
        CameraPreview.startCamera(options);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();
