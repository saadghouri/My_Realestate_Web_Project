<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed'); 

class UserAuth {

    private $CI;

    public function __construct()
    {
        $this->CI = & get_instance();
    }
    
    public function check_user_login()
    {
        $errors = array();
        $success = array();
        
        session_start();
        $x =$this->CI->session->userdata('userid');
        if($x != null || $x != '')
        {
            $email = $this->CI->session->userdata('userid');
            if($this->CI->login_model->validate_email($email)){
                $user_info = $this->CI->login_model->get_user_info($email);
                return $user_info;
            } else {
                return false;
            }
        }
        else
        {
            $errors['systemError'] = "Sorry, user are not authorised. 1";
            $errors['code'] = 302;
        }
        
        if(count($errors) != 0)
            $success = false;
            
        $data['errors'] = $errors;
        $data['success'] = $success;

        $this->response_json($data);
        exit();
    }

    public function response_json($data){
        header('Content-Type: application/json');
        echo json_encode($data);
        exit();
    }
}

/* End of file Someclass.php */