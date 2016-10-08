<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class User extends CI_Controller {

    public function __construct() {
        parent::__construct();
        date_default_timezone_set('US/Eastern');
        $this->load->helper('url');
        $this->load->model('login_model');
        $this->load->model('user_model');
        $this->load->library('session');
    }

    public function index() {
        echo "Access Dinied";
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
            $errors['systemError'] = "errors.permission_denied";
            $errors['redirectTo'] = "/login";
            $errors['code'] = 302;
        }

        if (count($errors) != 0)
            $success = false;

        $data['errors'] = $errors;
        $data['success'] = $success;

        $this->response_json($data);
        exit();
    }

    public function register() {
        $errors = array();
        $success = array();

        $email = trim(@$_POST["reg_email"]);
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = "errors.email_invalid";
            $errors['code'] = 302;
        } else {
            $user_data = $this->user_model->is_user_email_valid($email);
            if ($user_data) {
                $success['message'] = "User already registered with this e-mail";
                $success['data'] = array('registered' => 1);
            } else {
                $password = @$_POST['reg_password'];
                $first_name = @$_POST['first_name'];
                $last_name = @$_POST['last_name'];
                $phone_no = @$_POST['phone_no'];

                $reg_data = array(
                    'first_name' => $first_name,
                    'last_name' => $last_name,
                    'phone_no' => $phone_no,
                    'email' => $email,
                    'status' => 1,
                    'created_at' => date("Y-m-d H:i:s"),
                    'password' => md5($password)
                );

                if ($user_id = $this->user_model->save_user_info($reg_data)) {
                    if ($this->login_model->validate_login($email, $password) != 0 && $this->create_session($email)) {
                        $success = array('message' => "success.login");
                        $success = array('login' => "1");
                    } else {
                        $success = false;
                        $errors['systemError'] = 'Invalid';
                    }
                }
            }
        }

        if (count($errors) != 0)
            $success = false;

        $data['errors'] = $errors;
        $data['success'] = $success;

        $this->response_json($data);
        exit();
    }

    public function update_profile() {
        $errors = array();
        $success = array();
//print_r($_POST);exit;
        if ($user_data = $this->check_user_login()) {
            $email = trim(@$_POST["email"]);
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $errors['email'] = "Invalid Email Address";
                $errors['code'] = 302;
            } else {
                $isValid = $this->user_model->is_user_email_valid($email);
                if ($isValid) {
                    $password = @$_POST['password'];
                    $first_name = @$_POST['first_name'];
                    $last_name = @$_POST['last_name'];
                    $phone_no = @$_POST['phone_no'];

                    $data = array(
                        'first_name' => $first_name,
                        'last_name' => $last_name,
                        'phone_no' => $phone_no,
                        'password' => md5($password)
                    );

                    if ($user_id = $this->user_model->update_user_info($user_data->id, $data)) {
                        $success = array('message' => "Information Updated Successfully.");
                    } else {
                        $success = false;
                        $errors['systemError'] = 'Invalid';
                        $errors['data'] = 302;
                    }
                } else {
                    $errors['message'] = "Invalid User";
                    $errors['data'] = 302;
                }
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

    function create_session($email) {
        if ($email == "") {
            return false;
        }

        @session_start();
        $newdata = array(
            'userid' => $email,
            'timestamp' => time(),
            'logged_in' => TRUE
        );
        $this->session->set_userdata($newdata);
        return true;
    }

    public function response_json($data) {
        header('Content-Type: application/json');
        echo json_encode($data);
        exit();
    }

}
