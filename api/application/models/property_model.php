<?php

class Property_model extends CI_Model {

    function __construct() {
        parent::__construct();
        date_default_timezone_set('US/Eastern');
    }

    function get_data($id, $att) {
        $this->db->select($att);
        $this->db->where('id', $id);
        $result = $this->db->get('property')->result();

        if (count($result) == 0)
            return false;
        else
            return $result[0];
    }

    function get_att($id, $att) {
        $this->db->select($att);
        $this->db->where('id', $id);
        $result = $this->db->get('property')->result();

        if (count($result) == 0)
            return 0;
        else
            return $result[0]->{$att};
    }

    function save_property_info($data) {
        if (empty($data))
            return false;

        $this->db->insert('property', $data);
        return $this->db->insert_id();
    }

    function save_offer_info($data) {
        if (empty($data))
            return false;

        $this->db->insert('offers', $data);
        return $this->db->insert_id();
    }

    function get_property_info($id) {
        if ($id == "")
            return false;

        $this->db->where('id', $id);
        $result = $this->db->get('property')->result();

        if (count($result) == 0)
            return false;
        else
            return $result[0];
    }

    function get_offer_info($id) {
        if ($id == "")
            return false;

        $query = "SELECT * from offers where propertyId = $id AND ((timestampCreated >= (NOW() - INTERVAL 3 DAY)) OR (timestampCreated <= (NOW() - INTERVAL 3 DAY) AND accepted = 1)) ORDER BY id DESC";
//        $this->db->where('propertyId', $id);
//        $this->db->order_by('id', "DESC");
//        $this->db->where('timestampCreated >= (NOW() - INTERVAL 3 DAY)');
        //$this->db->where('accepted !=', 1);
        $result = $this->db->query($query)->result();

        if (count($result) == 0)
            return false;
        else
            return $result;
    }
    
    function check_user_offer($uid,$pid) {
        if ($uid == "" || $pid == "")
            return false;

        $this->db->where('propertyId', $pid);
        $this->db->where('userId', $uid);
        $result = $this->db->get('offers')->result();
        
        if (count($result) == 0)
            return false;
        else
            return true;
    }
    
    function getOfferCount($pid) {
        if ($pid == "")
            return 0;

        $query = "SELECT COUNT(id) as totalOffers from offers where propertyId = $pid AND ((timestampCreated >= (NOW() - INTERVAL 3 DAY)) OR (timestampCreated <= (NOW() - INTERVAL 3 DAY) AND accepted = 1))";
//        $this->db->select('COUNT(id) as totalOffers');
//        $this->db->where('propertyId', $pid);
//        $result = $this->db->get('offers')->result();
        $result = $this->db->query($query)->result();
        
        if (count($result) == 0)
            return 0;
        else
            return $result[0]->totalOffers;
    }
    
    function get_user_properties($uid) {
        if ($uid == "")
            return false;
        
        $this->db->where('userId', $uid);
        $this->db->order_by('id','DESC');
        $result = $this->db->get('property')->result();
        
        if (count($result) == 0)
            return false;
        else
            return $result;
    }
    
    function get_user_offers($uid) {
        if ($uid == "")
            return false;
        
        $query = "SELECT * from offers where userId = $uid AND ((timestampCreated >= (NOW() - INTERVAL 3 DAY)) OR (timestampCreated <= (NOW() - INTERVAL 3 DAY) AND accepted = 1))";
//        $this->db->where('userId', $uid);
//        $this->db->order_by('id','DESC');
        $result = $this->db->query($query)->result();
        
        if (count($result) == 0)
            return false;
        else
            return $result;
    }

    function get_recent_properties() {
        
//        $this->db->limit(6);
//        $this->db->order_by("id", "DESC");
//        $this->db->where('timestamp >= (NOW() - INTERVAL 15 DAY)');
//        $this->db->where('status !=', "Sold");
        
        $query = "SELECT * FROM property where ((timestampDeleted >= (NOW() - INTERVAL 15 DAY)) OR (timestampDeleted <= (NOW() - INTERVAL 15 DAY) AND status != 'Sold') OR (timestampDeleted IS NULL)) Order by id DESC Limit 6";
        
        $result = $this->db->query($query)->result();

        if (count($result) == 0)
            return false;
        else
            return $result;
    }

    function get_cities($iso) {
 
        $this->db->select('city');
        $this->db->where(array('state'=>$iso));
 
        $result = $this->db->get('cities')->result();
        
        if (count($result) == 0)
            return false;
        else
            return $result;
    }

    function get_states() {

        $result = $this->db->get('states')->result();

        if (count($result) == 0)
            return false;
        else
            return $result;
    }

    function get_state_city($city) {

        $this->db->select('states.name');
        $this->db->from('states');
        $this->db->where('cities.state = states.iso');
        $this->db->where('cities.city', $city);
        $result = $this->db->get('cities')->result();

        if (count($result) == 0)
            return false;
        else
            return $result[0]->name;
    }

    function get_property_images($id) {
        if ($id == "")
            return false;

        $this->db->select('image');
        $this->db->where('propertyId', $id);
        $this->db->where('deleted', 0);
        $result = $this->db->get('property_gallery')->result();

        if (count($result) == 0)
            return false;
        else
            return $result[0]->image;
    }

    function search_properties($data) {
        
        $state = isset($data['state']) ? $data['state'] : "";
        $city = isset($data['city']) ? $data['city'] : "";
        $status = isset($data['status']) ? $data['status'] : "";
        $type = isset($data['types']) ? $data['types'] : "";
        $bedrooms = isset($data['bedrooms']) ? $data['bedrooms'] : "";
        $bathrooms = isset($data['bathrooms']) ? $data['bathrooms'] : "";
        $price = isset($data['price']) ? $data['price'] : "";
        $school = isset($data['school']) ? $data['school'] : "";
        $hospital = isset($data['hospital']) ? $data['hospital'] : "";
        $shopping_center = isset($data['shopping_center']) ? $data['shopping_center'] : "";
        $park = isset($data['park']) ? $data['park'] : "";
        $sortBy = isset($data['sort']) ? $data['sort'] : "";
        
        $where = "";
        if ($school != "") {
            $school = $school == "true" ? 1 : 0;
            $this->db->where('school', $school);
            $where .= " AND school = $school";
        }
        if ($hospital != "") {
            $hospital = $hospital == "true" ? 1 : 0;
            $this->db->where('hospital', $hospital);
            $where .= " AND hospital = $hospital";
        }
        if ($shopping_center != "") {
            $shopping_center = $shopping_center == "true" ? 1 : 0;
            $this->db->where('shoppingCenter', $shopping_center);
            
            $where .= " AND shoppingCenter = $shopping_center";
        }
        if ($park != "") {
            $park = $park == "true" ? 1 : 0;
            $this->db->where('park', $park);
            $where .= " AND park = $park";
        }
        if ($state != "") {
            $this->db->where('state', $state);
            
            $where .= " AND state = '".$state."'";
        }
        if ($city != "") {
            $this->db->where('city', $city);
            
            $where .= " AND city ='". $city."'";
        }
        if ($status != "") {
            $this->db->where('status', $status);
            
            $where .= " AND status ='". $status."'";
        }
        if ($type != "") {
            $this->db->where('type', $type);
            $where .= " AND type = '".$type."'";
        }
        if ($bedrooms != "") {
            
            if($bedrooms >= 5){
                $this->db->where('bedrooms >=', 5);
                
            $where .= " AND bedrooms >= 5";
            } else {
                $this->db->where('bedrooms', $bedrooms);
                
            $where .= " AND bedrooms = $bedrooms";
            }
        }
        if ($bathrooms != "") {
            if($bathrooms >= 5){
                $this->db->where('bathrooms >=', 5);
            $where .= " AND bathrooms >= $bathrooms";
            } else {
                $this->db->where('bathrooms', $bathrooms);
            $where .= " AND bathrooms = $bathrooms";
            }
        }
        if ($price != "") {
            $minvalue = $price == 1 ? 0 : ($price == 2 ? 1000 : ($price == 3 ? 5001 : ($price == 4 ? 10000 : 50000))) ;
            $maxvalue = $price == 1 ? 999: ($price == 2 ? 5000 : ($price == 3 ? 9999: ($price == 4 ? 50000: 100000)));
            $this->db->where('price  BETWEEN '.$minvalue.' AND '.$maxvalue.'');
            $where .= ' AND price BETWEEN  '.$minvalue.' AND '.$maxvalue.'';
        }
        
        $where .= ' AND ((timestampDeleted >= (NOW() - INTERVAL 15 DAY)) OR (timestampDeleted <= (NOW() - INTERVAL 15 DAY) AND status != "Sold") OR (timestampDeleted IS NULL))';

//        $this->db->where('DATEDIFF(NOW(), `timestamp`) <=',15);
//        $this->db->where('timestampDeleted >= (NOW() - INTERVAL 15 DAY)');
//        $this->db->where('status !=',"Sold");
        
        if($sortBy == 0){
            $this->db->order_by("timestamp","DESC");
            $orderBy = " Order By timestamp DESC";
        } else {
//            $this->db->order_by("price","DESC");
            $orderBy = " Order By price ASC";
        }
        
        $query = "SELECT * FROM property where 1=1 ".$where." ".$orderBy;
//        print_r($query);
        
        $result = $this->db->get('property')->result();
        $result = $this->db->query($query)->result();

        if (count($result) == 0)
            return false;
        else
            return $result;
    }

}

?>