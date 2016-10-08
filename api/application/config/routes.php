<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
| This file lets you re-map URI requests to specific controller functions.
|
| Typically there is a one-to-one relationship between a URL string
| and its corresponding controller class/method. The segments in a
| URL normally follow this pattern:
|
|	example.com/class/method/id/
|
| In some instances, however, you may want to remap this relationship
| so that a different class/function is called than the one
| corresponding to the URL.
|
| Please see the user guide for complete details:
|
|	http://codeigniter.com/user_guide/general/routing.html
|
| -------------------------------------------------------------------------
| RESERVED ROUTES
| -------------------------------------------------------------------------
|
| There area two reserved routes:
|
|	$route['default_controller'] = 'welcome';
|
| This route indicates which controller class should be loaded if the
| URI contains no data. In the above example, the "welcome" class
| would be loaded.
|
|	$route['404_override'] = 'errors/page_missing';
|
| This route will tell the Router what URI segments to use if those provided
| in the URL cannot be matched to a valid route.
|
*/

$route['default_controller'] = "welcome";
$route['404_override'] = '';

//User Login/Registration/Profile
$route['login'] = 'login';
$route['logout']   = 'login/logout';
$route['profile']   = 'user/profile';
$route['do_login'] = 'login/do_login';
$route['register'] = 'user/register';
$route['validate_user'] = 'login/check_session';
$route['profile/update'] = 'user/update_profile';

//Property Management
$route['property/add'] = 'property/add';
$route['property/view'] = 'property/view';
$route['property/recent'] = 'property/recent';
$route['property/list'] = 'property/list';
$route['property/location'] = 'property/load_locations';
$route['property/photo'] = 'property/upload_photo';
$route['property/remove/photo'] = 'property/remove_photo';
$route['property/search'] = 'property/search';
$route['submit/offer'] = 'property/submit_offer';
$route['list/offer'] = 'property/offer_list';
$route['accept/offer'] = 'property/accept_offer';
$route['user/properties'] = 'property/user_properties';
$route['user/offers'] = 'property/user_offers';


//Password Management
$route['reset_password'] = 'login/reset_password';
$route['code_verification'] = 'login/code_verification';
$route['new_password'] = 'login/new_password';

//Testing
$route['testing'] = 'test';

//$route['get_pageviews'] = 'welcome/get_pageviews';
/* End of file routes.php */
/* Location: ./application/config/routes.php */