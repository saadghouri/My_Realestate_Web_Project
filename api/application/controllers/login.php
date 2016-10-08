<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Login extends CI_Controller {

    public function __construct() {
        parent::__construct();
        date_default_timezone_set('US/Eastern');
        $this->load->helper('url');
        $this->load->model('login_model');
        $this->load->library('session');
    }

    public function index() {
        $config = array(
	    'apikey' => '',      // Insert your api key
            'secure' => FALSE   // Optional (defaults to FALSE)
	);
	$this->load->library('MCAPI', $config, 'mail_chimp');
//        $apikey = 'api_key';

        $to_emails = array('raheelmalik068@gmail.com');
        $to_names = array('raheel');

        $message = array(
            'html' => 'Yo, this is the <b>html</b> portion',
            'text' => 'Yo, this is the *text* portion',
            'subject' => 'This is the subject',
            'from_name' => 'Me!',
            'from_email' => 'raheelmalik068@gmail.com',
            'to_email' => $to_emails,
            'to_name' => $to_names
        );

        $tags = array('WelcomeEmail');

        $params = array(
            'apikey' => $apikey,
            'message' => $message,
            'track_opens' => true,
            'track_clicks' => false,
            'tags' => $tags
        );

        $url = "http://us5.sts.mailchimp.com/1.0/SendEmail";

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url . '?' . http_build_query($params));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $result = curl_exec($ch);
        echo $result;
        curl_close($ch);

        $data = json_decode($result);
        echo "Status = " . $data->status . "\n";
    }

    public function check_session() {
        $errors = array();
        $success = array();

        session_start();
        $x = $this->session->userdata('userid');
        if ($x != null || $x != '') {
            $email = $this->session->userdata('userid');
            if ($this->login_model->validate_email($email)) {
                $user_info = $this->login_model->get_user_info($email);

                $success['message'] = "Welcome, " . $user_info->first_name . " " . $user_info->last_name;
                $success['data'] = $user_info;
                $success['time'] = date('h:i a');
            }
        } else {
//            $errors['systemError'] = 'session.exp_msg';
            $errors['code'] = 302;
        }

        if (count($errors) != 0)
            $success = false;

        $data['errors'] = $errors;
        $data['success'] = $success;

        $this->response_json($data);
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

    public function do_login() {
        $email = trim($_POST["email"]);
        $password = $_POST['password'];

        $errors = array();
        $success = array();

        if ($email == "") {
            $errors['email'] = "errors.email_invalid";
        } else {
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $errors['email'] = "errors.email_invalid";
            }
        }

        if ($password == "") {
            $errors['password'] = "errors.invalid_pwd";
        }

        if ($email != "" && $password != "") {
            if ($this->login_model->validate_login($email, $password) != 0 && $this->create_session($email)) {
                $success = array('message' => "success.login");
            } else {
                $success = false;
                $errors['systemError'] = 'errors.invalid_credentials';
            }
        }

        if (count($errors) != 0)
            $success = false;

        $data['errors'] = $errors;
        $data['success'] = $success;

        $this->response_json($data);
    }

    public function reset_password() {
        $email = trim($_POST["email"]);
        $building_id = @$_POST['building_id'];
        $building_id = trim($building_id);

        $errors = array();
        $success = array();

        if ($email == "") {
            $errors['email'] = "errors.email_invalid";
        } else {
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $errors['email'] = "errors.email_invalid";
            }
        }

        if ($email != "") {
            if ($this->login_model->validate_email($email)) {
                $code = rand(100000, 999999);
                if ($this->login_model->update_password_reset($email, $code) != 0) {
                    if ($building_id != null) {
                        $att['b_name'] = $this->building_model->get_att($building_id, 'name');
                    } else {
                        $att['b_name'] = 'AppartmentZ';
                    }
                    $success = array('message' => 'success.reset_pwd', 'email' => $email);
                    $content = "Please use code to reset your password. <br/> Code: " . $code;
                    $att['content'] = $content;
                    $this->aemail->set_tamplate(1, $att);
                    $this->aemail->send('', $email, 'Password Reset Code');
                } else {
                    $success = false;
                    $errors['systemError'] = "errors.cant_reset_pwd";
                }
            } else {
                $success = false;
                $errors['email'] = "errors.email_invalid";
            }
        }

        if (count($errors) != 0)
            $success = false;

        $data['errors'] = $errors;
        $data['success'] = $success;

        $this->response_json($data);
    }

    public function code_verification() {
        $code = trim($_POST["code"]);
        $email = trim($_POST["email"]);

        $errors = array();
        $success = array();

        if ($email == "") {
            $errors['email'] = "errors.email_invalid_2";
        } else {
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $errors['email'] = "errors.email_invalid_2";
            }
        }

        if ($email != "") {
            if ($this->login_model->validate_email($email)) {
                if ($this->login_model->validate_code($email, $code) != 0) {
                    $success = array('message' => "Enter Your password", 'code' => $code, 'email' => $email);
                } else {
                    $errors['systemError'] = "errors.code_invalid_expired";
                }
            } else {
                $errors['email'] = "errors.email_invalid_2";
            }
        }

        if (count($errors) != 0)
            $success = false;

        $data['errors'] = $errors;
        $data['success'] = $success;

        $this->response_json($data);
    }

    public function new_password() {

        $code = trim($_POST["code"]);
        $email = trim($_POST["email"]);
        $pass = trim($_POST['pass']);

        $errors = array();
        $success = array();

        if ($email == "") {
            $errors['systemError'] = "errors.email_invalid_2";
        } else {
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $errors['systemError'] = "errors.email_invalid_2";
            } else {
                if (!$this->login_model->validate_email($email))
                    $errors['systemError'] = "errors.email_invalid_2";
            }
        }

        if ($code != 0) {
            if ($this->login_model->validate_code($email, $code) == 0)
                $errors['systemError'] = "errors.code_invalid_expired";
        } else {
            $errors['systemError'] = "errors.code_invalid_expired";
        }

        if (strlen($pass) < 6 || strlen($pass) > 18 || $pass == "") {
            $errors['pass'] = "errors.invalid_pwd_2";
        }

        if (count($errors) == 0) {
            if ($this->login_model->update_password($email, $pass)) {
                $success = array('message' => "success.success_pwd");
                $errors = array();
            } else {
                $errors['systemError'] = "errors.cant_reset_pwd";
            }
        }
        if (count($errors) != 0)
            $success = false;

        $data['errors'] = $errors;
        $data['success'] = $success;

        $this->response_json($data);
    }

    public function generate_token() {
        $token = "";
        $codeAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        $codeAlphabet.= "abcdefghijklmnopqrstuvwxyz";
        $codeAlphabet.= "0123456789";
        for ($i = 0; $i < 40; $i++) {
            $token .= $codeAlphabet[$this->crypto_rand_secure(0, strlen($codeAlphabet))];
        }
        return $token;
    }

    function crypto_rand_secure($min, $max) {
        $range = $max - $min;
        if ($range < 0)
            return $min; // not so random...
        $log = log($range, 2);
        $bytes = (int) ($log / 8) + 1; // length in bytes
        $bits = (int) $log + 1; // length in bits
        $filter = (int) (1 << $bits) - 1; // set all lower bits to 1
        do {
            $rnd = hexdec(bin2hex(openssl_random_pseudo_bytes($bytes)));
            $rnd = $rnd & $filter; // discard irrelevant bits
        } while ($rnd >= $range);
    }

    public function response_json($data) {
        header('Content-Type: application/json');
        echo json_encode($data);
        exit();
    }

    public function logout() {
        @session_start();
        $this->session->sess_destroy();
        $this->session->set_userdata(array('userid' => ''));

        $errors = array();
        $success = array();

        $success['message'] = "success.logout";

        if (!isset($errors))
            $success = false;

        $data['errors'] = $errors;
        $data['success'] = $success;

        $this->response_json($data);
    }

}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */