<?php
class Login_model extends CI_Model {
	function __construct() {
		parent::__construct();
        date_default_timezone_set('US/Eastern');
	}

    function validate_login($email,$pass)
    {
        if($email == "" || $pass =="")
            return 0;

        $this->db->where('email',trim($email));
        $this->db->where('password',md5(trim($pass)));
        $this->db->where('status', 1);
        $result=$this->db->get('user_info')->result();

        if(count($result)==0)
            $result = 0;
        return $result;
    }
    
    function validate_email($email)
    {
        if($email == "")
            return 0;

        $this->db->where('email',trim($email));
        $result=$this->db->get('user_info')->result();

        if(count($result)==0)
            return false;
        else
            return true;
    }
    
    function update_password_reset($email,$code)
    {
        if($email == "")
            return 0;

        $this->db->where('email',trim($email));
        $update_array = array('reset_code'=> $code);
        $result=$this->db->update('user_info',$update_array);

        if($result==0)
            $result = 0;
            
        return $result;
    }
    
    function validate_code($email, $code)
    {
        if($email == "" || $code == "")
            return 0;

        $this->db->where('email',trim($email));
        $this->db->where('reset_code',trim($code));
        $result=$this->db->get('user_info')->result();

        if(count($result)==0)
            $result = 0;
            
        return $result;
    }
    
    function update_password($email,$pass)
    {
        $this->db->where('email',trim($email));
        $update_array = array('password'=> md5(trim($pass)), 'reset_code'=>'');
        $result=$this->db->update('user_info',$update_array);

        if($result==0)
            $result = false;
        else
            $result = true;
            
        return $result;
    }
    
    function get_user_type($email)
    {
        $this->db->select('user_type');
        $this->db->where('email',trim($email));
        $result=$this->db->get('user_info')->result();

        if(count($result)==0)
            return 0;
        else
            return $result[0]->user_type;
    }
    
    function get_user_info($email)
    {
        $this->db->where('email',trim($email));
        $result=$this->db->get('user_info')->result();

        if(count($result)==0)
            return 0;
        else
            return $result[0];
    }
 }

 ?>