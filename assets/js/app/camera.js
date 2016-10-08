/*jslint sloppy:true, browser:true, devel:true, white:true, vars:true, eqeq:true, plusplus:true */
/*global $:false, intel:false*/
/** 
 * This function runs once the page is loaded, but intel is not yet active 
 */

var windowHeight;
var init = function () {
    windowHeight=window.innerHeight;
};

window.addEventListener("load", init, false);  

/**
 * Prevent Default Scrolling 
 */
var preventDefaultScroll = function(event) 
{
    // Prevent scrolling on this element
    event.preventDefault();
    //window.scroll(0,0);
    return false;
};
    
//window.document.addEventListener("touchmove", preventDefaultScroll, false);

/**
 * Device Ready Code 
*/

var onDeviceReady=function(){                             // called when Cordova is ready
   if( window.Cordova && navigator.splashscreen ) {     // Cordova API detected
        navigator.splashscreen.hide() ;                 // hide splash screen
    }
} ;
document.addEventListener("deviceready", onDeviceReady, false);


//Event listener for camera
document.addEventListener("intel.xdk.camera.picture.add",onSuccess); 
document.addEventListener("intel.xdk.camera.picture.busy",onSuccess); 
document.addEventListener("intel.xdk.camera.picture.cancel",onSuccess); 
var picturecount=0;

function onSuccess(event) 
{
    if (event.success === true)
    {
        var imagesrc = intel.xdk.camera.getPictureURL(event.filename);
       //alert("File upload called, api2");
       var user_id = $("user_id").val();
       intel.xdk.file.uploadToServer(imagesrc,get_base_url()+"/workorderjob/photo_upload?id="+getUrlParameter('id')+"&user_id="+user_id, "", "image/jpeg", "updateUploadProgress");
    }
    else
    {
        if (event.message !== undefined)
        {
            alert(event.message);
        }
        else
        {
            alert("error capturing picture");
        }
    }
}

//Camera button functionality
function takepicture()
{
    intel.xdk.camera.takePicture(80, true, "jpg");
}

function updateUploadProgress(bytesSent,totalBytes)
{
    var currentProgress = 0;
   if(totalBytes>0)
        currentProgress=(bytesSent/totalBytes)*100;
   document.getElementById("progress").innerHTML=currentProgress+"%";
}

document.addEventListener("intel.xdk.file.upload.busy",uploadBusy);
document.addEventListener("intel.xdk.file.upload",uploadComplete);
document.addEventListener("intel.xdk.file.upload.cancel",uploadCancelled);

function uploadBusy(evt)
{
   alert("Sorry, a file is already being uploaded");
}

function uploadComplete(evt)
{
   if(evt.success==true)
   {
       //console.log(evt);
      //alert("File "+evt.localURL+" was uploaded");
      window.location.href = "workorder_view.html?id="+getUrlParameter('id')+"&history=ture";
   }
   else {
      alert("Error uploading file "+evt.message);
   }
}

function uploadCancelled(evt)
{
    alert("File upload was cancelled "+evt.localURL);
}
