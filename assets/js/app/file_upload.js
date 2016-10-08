function start_file_upload(){
  var pictureURL = "file:///Applications/Intel%20XDK.app/Contents/Resources/app.nw/components/client/emulator/xdk/images/stock_photos/photo-06.jpg";
  intel.xdk.file.uploadToServer(pictureURL,"http://localhost/ajaxFileUpload/submit.php", "", "image/jpeg", "updateUploadProgress");
}

function updateUploadProgress(bytesSent,totalBytes)
{
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
      alert("File "+evt.localURL+" was uploaded");
   }
   else {
      alert("Error uploading file "+evt.message);
   }
}

function uploadCancelled(evt)
{
    alert("File upload was cancelled "+evt.localURL);
}