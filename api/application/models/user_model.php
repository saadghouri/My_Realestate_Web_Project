<?php

class User_model extends CI_Model {

    function __construct() {
        parent::__construct();
        date_default_timezone_set('US/Eastern');
    }

    function get_data($id, $att) {
        $this->db->select($att);
        $this->db->where('id', $id);
        $result = $this->db->get('user_info')->result();

        if (count($result) == 0)
            return false;
        else
            return $result[0];
    }

    function get_att($id, $att) {
        $this->db->select($att);
        $this->db->where('id', $id);
        $result = $this->db->get('user_info')->result();

        if (count($result) == 0)
            return 0;
        else
            return $result[0]->{$att};
    }

    function save_user_info($data) {
        if (empty($data))
            return false;

        if ($this->db->insert('user_info', $data)) {
            $this->db->select('id');
            $where_array = array(
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'phone_no' => $data['phone_no'],
                'email' => $data['email'],
                'status' => 1,
                'created_at' => $data['created_at'],
                'password' => $data['password']
            );
            $this->db->where($where_array);
            $result = $this->db->get('user_info')->result();

            if (count($result) == 0)
                return false;
            else
                return $result[0]->id;
        } else
            return false;
    }

    function is_user_email_valid($email) {
        if ($email == "")
            return false;
        $this->db->where('email', $email);
        $result = $this->db->get('user_info')->result();

        if (count($result) == 0)
            return false;
        else
            return $result[0];
    }

    function get_id($email) {
        $this->db->select('id');
        $this->db->where('email', $email);
        $result = $this->db->get('user_info')->result();

        if (count($result) == 0)
            return false;
        else
            return $result[0]->id;
    }

    function is_user_valid($id) {
        $this->db->where('id', $id);
        $result = $this->db->get('user_info')->result();

        if (count($result) == 0)
            return false;
        else
            return true;
    }

    function get_user_name($id) {
        if ($id == "")
            return false;

        $this->db->select('first_name ,last_name');
        $this->db->where('id', $id);
        $result = $this->db->get('user_info')->result();

        if (count($result) == 0)
            return false;
        else
            return $result[0]->first_name . " " . $result[0]->last_name;
    }    
    
    function get_user_info($id) {
        if ($id == "")
            return false;

        $this->db->where('id', $id);
        $result = $this->db->get('user_info')->result();

        if (count($result) == 0)
            return false;
        else
            return $result[0];
    }

    function update_user_info($id, $data) {
        if($id == "" || count($data) == 0)
            return false;
        
        $this->db->where('id', $id);
        return $this->db->update('user_info', $data);
    }

}

?>