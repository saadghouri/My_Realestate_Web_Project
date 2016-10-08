<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Property extends CI_Controller {

    public function __construct() {
        parent::__construct();
        date_default_timezone_set('US/Eastern');
        $this->load->helper('url');
        $this->load->model('login_model');
        $this->load->model('property_model');
        $this->load->model('user_model');
        $this->load->library('session');
    }

    public function index() {
        echo "login class";
    }

    public function check_user_login() {
        $errors = array();
        $success = array();

        session_start();
        $x = $this->session->userdata('userid');
        if ($x != null || $x != '') {
            $email = $this->session->userdata('userid');
            if ($this->login_model->validate_email($email)) {
                $user_info = $this->login_model->get_user_info($email);
                return $user_info;
            } else {
                return false;
            }
        } else {
            $errors['systemError'] = "errors.not_authorised";
            $errors['code'] = 302;
        }

        if (count($errors) != 0)
            $success = false;

        $data['errors'] = $errors;
        $data['success'] = $success;

        $this->response_json($data);
        exit();
    }

    public function add() {
        $errors = array();
        $success = array();
//print_r($_POST);exit;
        if ($user_data = $this->check_user_login()) {
            $query_data['userId'] = $user_data->id;
            $query_data['title'] = @$_POST['title'];
            $query_data['area'] = @$_POST['area'];
            $query_data['description'] = @$_POST['desc'];
            $property_images = false;
            if (@isset($_POST['propertyImages'])) {
                $property_images = @$_POST['propertyImages'];
            }
            
            $query_data['type'] = @$_POST['type'];
            $query_data['status'] = @$_POST['status'];
            $query_data['price'] = @$_POST['price'];
            $query_data['bedrooms'] = @$_POST['bedrooms'];
            $query_data['bathrooms'] = @$_POST['bathrooms'];
            $query_data['lotarea'] = @$_POST['lotarea'];
            $query_data['yearbuilt'] = @$_POST['yearbuilt'];
            $query_data['flooring'] = @$_POST['flooring'];
            $query_data['garagesize'] = @$_POST['garagesize'];
            $query_data['roofing'] = @$_POST['roofing'];
            $query_data['parking'] = @$_POST['parking'];
            $query_data['style'] = @$_POST['style'];
            $query_data['address'] = @$_POST['address'];
            $query_data['city'] = @$_POST['city'];
            $query_data['country'] = @$_POST['country'];
            $state = $this->property_model->get_state_city($query_data['city']);
            $query_data['state'] = $state;
            $query_data['amenities'] = @$_POST['amenities'];
            $query_data['video'] = @$_POST['video'];
            $query_data['featured'] = 0;
            $query_data['timestamp'] = date("Y-m-d H:i:s");
            
            if(isset($_POST['school'])){
                $query_data['school'] = $_POST['school'] ? 1 : 0;
            }
            if(isset($_POST['shopping_center'])){
                $query_data['shoppingCenter'] = $_POST['shopping_center'] ? 1 : 0;
            }
            if(isset($_POST['hospital'])){
                $query_data['hospital'] = $_POST['hospital'] ? 1 : 0;
            }
            if(isset($_POST['park'])){
                $query_data['park'] = $_POST['park'] ? 1 : 0;
            }

            if ($property_id = $this->property_model->save_property_info($query_data)) {
                if ($property_images) {
                    $att['property_images'] = $property_images;
                    foreach ($property_images as $image_name) {
                        $property_image_data = array(
                            "propertyId" => $property_id,
                            "image" => $image_name,
                            "timestamp" => date("Y-m-d H:i:s")
                        );
                        $this->db->insert('property_gallery', $property_image_data);
                    }
                }
                $success['message'] = "Property Posted Successfully.";
                $success['id'] = $property_id;
            } else {
                $errors['systemError'] = "Unable to save data.";
                $errors['code'] = 302;
            }
        }

        if (count($errors) != 0)
            $success = false;

        $data['errors'] = $errors;
        $data['success'] = $success;

        $this->response_json($data);
    }

    public function view() {
        $errors = array();
        $success = array();
//print_r($_POST);exit;
        $id = @$_POST['id'];

        $property_details = $this->property_model->get_property_info($id);
        $property_images = $this->property_model->get_property_images($id);
        if ($property_images) {
            $image_path = base_url() . 'api/propertyPic/' . $property_images;
        } else {
            $image_path = "assets/real_estate/images/property/property1.jpg";
        }
        if ($property_details) {
            
            $property_details->posted = $this->ago(strtotime($property_details->timestamp));
            $property_details->posted1 = date("d M Y",strtotime($property_details->timestamp));
            $owner_details = $this->user_model->get_user_info($property_details->userId);
            
            $makeOffer = false;
            $property_owner = false;
            $offer_already_made = false;
            
            $totalOffers = $this->property_model->getOfferCount($id);
            
            if ($this->session->userdata('userid')) {
                $email = $this->session->userdata('userid');
                if ($this->login_model->validate_email($email)) {
                    $user_info = $this->login_model->get_user_info($email);
                }
                $makeOffer = true;
                $offer_already_made = $this->property_model->check_user_offer($user_info->id,$id);
                if ($owner_details->id == $user_info->id) {
                    $makeOffer = false;
                    $property_owner = true;
                }
            }

            $data = array(
                "makeOffer" => $makeOffer,
                "propertyOwner" => $property_owner,
                "propertyData" => $property_details,
                "ownerData" => $owner_details,
                'property_images' => $image_path,
                'offer_already_made' => $offer_already_made,
                'total_offers' => $totalOffers
            );

            $success['message'] = "Loaded";
            $success['data'] = $data;
        } else {
            $errors['systemError'] = "No data found.";
            $errors['code'] = 302;
        }

        if (count($errors) != 0)
            $success = false;

        $data['errors'] = $errors;
        $data['success'] = $success;

        $this->response_json($data);
    }

    public function recent() {
        $errors = array();
        $success = array();

        $recent_property = $this->property_model->get_recent_properties();
        $recentProperties = array();
        
        if ($recent_property) {
            foreach ($recent_property as $property) {
                $property_images = $this->property_model->get_property_images($property->id);
                if ($property_images) {
                    $image_path = base_url() . 'api/propertyPic/' . $property_images;
                } else {
                    $image_path = "assets/real_estate/images/property/property1.jpg";
                }
                $property->image_path = $image_path;
                $recentProperties[] = $property;
            }
            $data = array(
                "recent_property" => $recentProperties
            );

            $success['message'] = "Loaded";
            $success['data'] = $data;
        } else {
            $errors['systemError'] = "No data found.";
            $errors['code'] = 302;
        }

        if (count($errors) != 0)
            $success = false;

        $data['errors'] = $errors;
        $data['success'] = $success;

        $this->response_json($data);
    }

    public function load_locations() {
        $errors = array();
        $success = array();

        $states = $this->property_model->get_states();
        $list = array();
        foreach ($states as $state) {
            $cities = $this->property_model->get_cities($state->iso);
            foreach ($cities as $city) {
                $list[$state->name][] = $city->city;
            }
        }
        $countryList['Canada'] = $list;

        if ($countryList) {

            $success['message'] = "Loaded";
            $success['data'] = $countryList;
        } else {
            $errors['systemError'] = "No data found.";
            $errors['code'] = 302;
        }

        if (count($errors) != 0)
            $success = false;

        $data['errors'] = $errors;
        $data['success'] = $success;

        $this->response_json($data);
    }

    public function upload_photo() {
        $Apple = array();
        $Apple['UA'] = $_SERVER['HTTP_USER_AGENT'];
        $Apple['Device'] = false;
        $Apple['Types'] = array('iPhone', 'iPod', 'iPad');
        $image_rotation_flag = false;
        foreach ($Apple['Types'] as $d => $t) {
            if (strpos($Apple['UA'], $t) !== false) {
                $image_rotation_flag = true;
            }
        }

        $errors = array();
        $success = array();

        if ($user_data = $this->check_user_login()) {
            //continue only if $_POST is set and it is a Ajax request
            if (isset($_FILES)) {
                foreach ($_FILES as $file) {
                    if ($file['error']) {
                        $errors['systemError'] = "errors.not_image_file";
                        $errors['code'] = 302;
                    } else {
                        $target_dir = "orgImages/property/";
                        $timestamp = time();

                        $image_name = $file['name']; //file name
                        $image_size = $file['size']; //file size
                        $image_temp = $file['tmp_name']; //file temp
                        $image_size_info = getimagesize($image_temp); //get image size

                        $target_file = $target_dir . $timestamp . "_" . basename($image_name);
                        $uploadOk = 1;
                        $imageFileType = pathinfo($target_file, PATHINFO_EXTENSION);

                        $image_info = pathinfo($image_name);
                        $image_extension = strtolower($image_info["extension"]); //image extension
                        $image_name_only = strtolower($image_info["filename"]); //file name only, no extension    
                        $image_name_only = md5($image_name_only . time());

                        $code = rand(100000, 999999);
                        $new_file_name = md5($code . $image_name . time()) . "." . $image_extension;
                        $target_file = $target_dir . $new_file_name;

                        if ($image_size > (1024 * 1024 * 20)) {
                            $errors['systemError'] = "errors.large_file";
                            $errors['code'] = 302;
                            $uploadOk = 0;
                        }

                        if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif") {
                            $errors['systemError'] = "errors.file_type";
                            $errors['code'] = 302;
                            $uploadOk = 0;
                        }

                        if ($uploadOk == 0) {
                            $errors['systemError'] = "errors.file_upload";
                            $errors['code'] = 302;
                        } else {
                            if (move_uploaded_file($image_temp, $target_file)) {
                                //echo "The file  has been uploaded.";
                                $source_path = 'orgImages/property/' . $new_file_name;
                                $target_path = 'propertyPic/' . $new_file_name;
                                $this->resize_image($source_path, $target_path);

                                $success['message'] = "success.propertypic_uploaded";
                                $success['data'] = array('pic_url' => base_url() . 'api/propertyPic/' . $new_file_name, 'pic_name' => $new_file_name);

                                if ($image_rotation_flag) {
                                    $this->rotate_image($target_path);
                                }
//                                $success['data'] = array('pic_url' => base_url() . 'api/profilePic/' . $new_file_name, 'pic_url_thumb' => base_url() . 'api/profilePic/thumb_' . $new_file_name);
                            } else {
                                //echo "Sorry, there was an error uploading your file.";
                            }
                        }
                    }
                }
            } else {
                $errors['systemError'] = "errors.not_auth_to_upload_propertypic";
                $errors['code'] = 302;
            }
        } else {
            $errors['systemError'] = "errors.form_not_submitted";
            $errors['code'] = 302;
        }

        if (count($errors) != 0)
            $success = false;

        $data['errors'] = $errors;
        $data['success'] = $success;

        $this->response_json($data);
    }   
    
    function remove_photo() {
        $errors = array();
        $success = array();
//print_r(@$_POST);exit;
        if ($user_data = $this->check_user_login()) {
            $image_name = @$_POST['image_name'];
            $file_path = $_SERVER['DOCUMENT_ROOT'] . 'api/propertyPic/' . $image_name;
            if (isset($_POST['edit'])) {
                if ((@$_POST['old'])) {
                    $this->db->where('image', $image_name);
                    $this->db->update('property_gallery', array('timestampDeletedAt' => date("Y-m-d H:i:s")));
                    $result = true;
                } else {
                    $result = @unlink($file_path);
                }
                $success['data'] = $result;
                if (!$result) {
                    $error['message'] = 'errors.unable_to_delete';
                }
            } else {
                $result = @unlink($file_path);
                if ($result) {
                    $success['data'] = $result;
                } else {
                    $error['message'] = 'errors.unable_to_delete';
                }
            }
        }

        if (count($errors) != 0)
            $success = false;

        $data['errors'] = $errors;
        $data['success'] = $success;

        $this->response_json($data);
    }
    
    function search() {
        $errors = array();
        $success = array();
//print_r(@$_POST);exit;
        $search_property = $this->property_model->search_properties(@$_POST);
        $searchProperties = array();
        if($search_property){
            foreach ($search_property as $property) {
                $property_images = $this->property_model->get_property_images($property->id);
                if ($property_images) {
                    $image_path = base_url() . 'api/propertyPic/' . $property_images;
                } else {
                    $image_path = "assets/real_estate/images/property/property1.jpg";
                }
                $property->image_path = $image_path;
                $property->posted = date("d M Y", strtotime($property->timestamp));
                $searchProperties[] = $property;
            }
            if ($searchProperties) {
                $data = array(
                    "search_property" => $searchProperties
                );

                $success['message'] = "Loaded";
                $success['data'] = $data;
            } else {
                $errors['systemError'] = "No data found.";
                $errors['code'] = 302;
            }
        }  else {
            $errors['systemError'] = "No Result found.";
            $errors['code'] = 302;
        }

        if (count($errors) != 0)
            $success = false;

        $data['errors'] = $errors;
        $data['success'] = $success;

        $this->response_json($data);
    }
    
    function user_properties() {
        $errors = array();
        $success = array();
//print_r(@$_POST);exit;
        if ($user_data = $this->check_user_login()) {
            $user_property = $this->property_model->get_user_properties($user_data->id);
            $userProperties = array();
            if ($user_property) {
                foreach ($user_property as $property) {
                    $property_images = $this->property_model->get_property_images($property->id);
                    if ($property_images) {
                        $image_path = base_url() . 'api/propertyPic/' . $property_images;
                    } else {
                        $image_path = "assets/real_estate/images/property/property1.jpg";
                    }
                    $property->image_path = $image_path;
                    $property->posted = date("d M Y", strtotime($property->timestamp));
                    $userProperties[] = $property;
                }
                if ($userProperties) {
                    $data = array(
                        "user_property" => $userProperties
                    );

                    $success['message'] = "Loaded";
                    $success['data'] = $data;
                } else {
                    $errors['systemError'] = "No data found.";
                    $errors['code'] = 302;
                }
            } else {
                $errors['systemError'] = "No Result found.";
                $errors['code'] = 302;
            }
        }

        if (count($errors) != 0)
            $success = false;

        $data['errors'] = $errors;
        $data['success'] = $success;

        $this->response_json($data);
    }
    
    function user_offers() {
        $errors = array();
        $success = array();
//print_r(@$_POST);exit;
        if ($user_data = $this->check_user_login()) {
            $user_offer = $this->property_model->get_user_offers($user_data->id);
            $userOffers = array();
            if ($user_offer) {
                foreach ($user_offer as $offer) {
                    $offer->time = date("d M Y", strtotime($offer->timestampCreated));
                    $offer->status = $offer->accepted == "1"? "Offer Accepted" : ($offer->accepted == "-1"? "Property Sold" : "Pending");
                    $offer->propertyName = $this->property_model->get_att($offer->propertyId , 'title');
                    $userOffers[] = $offer;
                }
                if ($userOffers) {
                    $data = array(
                        "user_offer" => $userOffers
                    );

                    $success['message'] = "Loaded";
                    $success['data'] = $data;
                } else {
                    $errors['systemError'] = "No data found.";
                    $errors['code'] = 302;
                }
            } else {
                $errors['systemError'] = "No Result found.";
                $errors['code'] = 302;
            }
        }

        if (count($errors) != 0)
            $success = false;

        $data['errors'] = $errors;
        $data['success'] = $success;

        $this->response_json($data);
    }
    
    function submit_offer() {
        $errors = array();
        $success = array();
//print_r($_POST);exit;
        if ($user_data = $this->check_user_login()) {
//            print_r($user_data);exit;
            $query_data['userId'] = $user_data->id;
            $query_data['propertyId'] = @$_POST['id'];
            $query_data['message'] = @$_POST['message'];
            $query_data['email'] = $user_data->email;
            $query_data['name'] = $user_data->first_name . " ". $user_data->last_name;
            $query_data['price'] = @$_POST['price'];
            $query_data['timestampCreated'] = date("Y-m-d H:i:s");
            

            if ($offer_id = $this->property_model->save_offer_info($query_data)) {
                $success['message'] = "Offer Submitted Successfully.";
                $success['id'] = $offer_id;
            } else {
                $errors['systemError'] = "Unable to submit an Offer.";
                $errors['code'] = 302;
            }
        } else {
            $errors['systemError'] = "You need to login in order to accept offer.";
            $errors['code'] = 302;
        }

        if (count($errors) != 0)
            $success = false;

        $data['errors'] = $errors;
        $data['success'] = $success;

        $this->response_json($data);
    }
    
    function offer_list() {
        $errors = array();
        $success = array();
//print_r($_POST);exit;
        $pid = @$_POST['id'];

        $property_details = $this->property_model->get_offer_info($pid);
        if ($property_details) {
            $success['message'] = "Loaded";
            $success['data'] = $property_details;
        } else {
            $errors['systemError'] = "No data found.";
            $errors['code'] = 302;
        }

        if (count($errors) != 0)
            $success = false;

        $data['errors'] = $errors;
        $data['success'] = $success;

        $this->response_json($data);
    }
    
    function accept_offer() {
        $errors = array();
        $success = array();
//print_r($_POST);exit;
        $id = @$_POST['id'];
        $pid = @$_POST['pid'];

        $this->db->where('id',$id);
        
        if ($this->db->update('offers',array("accepted" => 1 , "timestampAccepted" => date("Y-m-d H:i:s")))) {
            
            $this->db->where('id',$pid);
            $this->db->update('property', array("status" => 'Sold' , "timestampDeleted" => date("Y-m-d H:i:s")));
            
            $success['message'] = "Loaded";
            $success['data'] = "success";
        } else {
            $errors['systemError'] = "No data found.";
            $errors['code'] = 302;
        }

        if (count($errors) != 0)
            $success = false;

        $data['errors'] = $errors;
        $data['success'] = $success;

        $this->response_json($data);
    }

    //New Image Resizer
    public function resize_image($source_path, $target_path) {
        $this->load->library('image_lib');
        $this->image_lib->clear();
        $config['image_library'] = 'gd2';
        $config['source_image'] = $source_path;
        $config['new_image'] = $target_path;
        $config['create_thumb'] = FALSE;
        $config['maintain_ratio'] = TRUE;
        $config['width'] = 750;
        $config['height'] = 469;

        $this->image_lib->initialize($config);

        if (!$this->image_lib->resize()) {
            return false;
        } else {
            return true;
        }
        $this->image_lib->clear();
    }

    public function rotate_image($source_path) {
        $this->load->library('image_lib');
        $this->image_lib->clear();
        $config['image_library'] = 'gd2';
        $config['source_image'] = $source_path;
        $config['new_image'] = $source_path;
        $config['rotation_angle'] = '270';

        $this->image_lib->initialize($config);
        if (!$this->image_lib->rotate()) {
            return false;
        } else {
            return true;
        }
        $this->image_lib->clear();
    }

    #####  This function will proportionally resize image ##### 

    function normal_resize_image($source, $destination, $image_type, $max_size, $image_width, $image_height, $quality) {

        if ($image_width <= 0 || $image_height <= 0) {
            return false;
        } //return false if nothing to resize
        //do not resize if image is smaller than max size
        if ($image_width <= $max_size && $image_height <= $max_size) {
            if (save_image($source, $destination, $image_type, $quality)) {
                return true;
            }
        }

        //Construct a proportional size of new image
        $image_scale = min($max_size / $image_width, $max_size / $image_height);
        $new_width = ceil($image_scale * $image_width);
        $new_height = ceil($image_scale * $image_height);

        $new_canvas = imagecreatetruecolor($new_width, $new_height); //Create a new true color image
        //Copy and resize part of an image with resampling
        if (imagecopyresampled($new_canvas, $source, 0, 0, 0, 0, $new_width, $new_height, $image_width, $image_height)) {
            $this->save_image($new_canvas, $destination, $image_type, $quality); //save resized image
        }

        return true;
    }

    ##### This function corps image to create exact square, no matter what its original size! ######

    function crop_image_square($source, $destination, $image_type, $square_size, $image_width, $image_height, $quality) {
        if ($image_width <= 0 || $image_height <= 0) {
            return false;
        } //return false if nothing to resize

        if ($image_width > $image_height) {
            $y_offset = 0;
            $x_offset = ($image_width - $image_height) / 2;
            $s_size = $image_width - ($x_offset * 2);
        } else {
            $x_offset = 0;
            $y_offset = ($image_height - $image_width) / 2;
            $s_size = $image_height - ($y_offset * 2);
        }
        $new_canvas = imagecreatetruecolor($square_size, $square_size); //Create a new true color image
        //Copy and resize part of an image with resampling
        if (imagecopyresampled($new_canvas, $source, 0, 0, $x_offset, $y_offset, $square_size, $square_size, $s_size, $s_size)) {
            $this->save_image($new_canvas, $destination, $image_type, $quality);
        }

        return true;
    }

    ##### Saves image resource to file ##### 

    function save_image($source, $destination, $image_type, $quality) {
        switch (strtolower($image_type)) {//determine mime type
            case 'image/png':
                imagepng($source, $destination);
                return true; //save png file
                break;
            case 'image/gif':
                imagegif($source, $destination);
                return true; //save gif file
                break;
            case 'image/jpeg': case 'image/pjpeg':
                imagejpeg($source, $destination, $quality);
                return true; //save jpeg file
                break;
            default: return false;
        }
    }

    public function response_json($data) {
        header('Content-Type: application/json');
        echo json_encode($data);
        exit();
    }

    public function convert_totime($sec) {

        $seconds = $sec;

        $ret = array();

        $divs = array(3600, 60, 1);

        for ($d = 0; $d < 3; $d++) {
            $q = $seconds / $divs[$d];
            $r = $seconds % $divs[$d];
            $ret[substr('hms', $d, 1)] = $q;

            $seconds = $r;
        }

        //return sprintf("%dh, %dm, %ds\n", $ret['h'], $ret['m'], $ret['s']);
        return sprintf("%dh, %dm, %ds\n", $ret['h'], $ret['m'], $ret['s']);
    }
    
    
    public function ago($time) {
        $periods = array("second", "minute", "hour", "day", "week", "month", "year", "decade");
        $lengths = array("60", "60", "24", "7", "4.35", "12", "10");

        $now = time();

        $difference = $now - $time;
        $tense = "ago";

        for ($j = 0; $difference >= $lengths[$j] && $j < count($lengths) - 1; $j++) {
            $difference /= $lengths[$j];
        }

        $difference = round($difference);

        if ($difference != 1) {
            $periods[$j].= "s";
        }

        return "$difference $periods[$j] ago ";
    }

}
