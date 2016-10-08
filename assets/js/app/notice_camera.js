//				var files;
//				function prepareUpload(event)
//				{
//					files = event.target.files;
//					if(files.length > 0){
//						uploadFiles(event);
//					}
//				}
//
//				// Catch the form submit and upload the files
//				function uploadFiles(event)
//				{
//					event.stopPropagation(); // Stop stuff happening
//			        event.preventDefault(); // Totally stop stuff happening
//
//			        // START A LOADING SPINNER HERE
//
//			        // Create a formdata object and add the files
//			        var data = new FormData();
//			        $.each(files, function(key, value)
//			        {
//			        	data.append(key, value);
//			        });
//			        
//			        $.ajax({
//			        	url: get_base_url()+'/notices/upload/photo',
//			        	type: 'POST',
//			        	data: data,
//			        	cache: false,
//			        	dataType: 'json',
//			            processData: false, // Don't process the files
//			            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
//			            success: function(data, textStatus, jqXHR)
//			            {
//                                        var image_url = data.success.data.pic_url;
//                                        $('#notice_images').append('<br/><br/><div><img src="'+image_url+'" style="max-width: 100%;height: auto;"/><input type="hidden" value="'+image_url+'" name="notice_images[]" ng-model="noticesData.noticeImages" /></div>')
//                                        console.log(image_url);
////			            	window.history.replaceState(null, document.title, "workorder_view.html?id="+getUrlParameter('id')+"&history=ture");
////			            	window.location.reload();
//			            },
//			            error: function(jqXHR, textStatus, errorThrown)
//			            {
//			            	// Handle errors here
//			            	console.log('ERRORS: ' + textStatus);
//			            	// STOP LOADING SPINNER
//			            }
//			        });
//			    }