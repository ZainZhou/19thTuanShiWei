<?php
namespace Home\Controller;

use Think\Controller;

class BaseController extends Controller {
    protected $oauthDomain = 'https://wx.idsbllp.cn';
    protected $callbackurl = 'https://wx.idsbllp.cn/game/19thQuestionAnswer/'; //硬编码算了, 估计那边rewrite规则有问题 'https://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI']
    public function _initialize() {
        header('Access-Control-Allow-Origin: *');
        if (APP_DEBUG) {
            $openid = 'ouRCyjhdsj8RQofIOPHc7nX9hA98';//session('openid');//
            $nickname = '知识混子周政';// session('nickname'); //
        } else {
            $openid = session('openid');//
            $nickname = session('nickname'); //
        }
        if (!$openid || !$nickname) {
            $openid = I('get.openid');
            $nickname = urldecode(I('get.nickname'));//'知识混子周政';//
        }
        if (!$openid  || !$nickname) {
            $uri = $this->oauthDomain.'/MagicLoop/index.php?s=/addon/Api/Api/oauth&redirect='.urlencode($this->callbackurl);
            redirect($uri);
        }
        session('openid', $openid);
        session('nickname', $nickname);
        $users = M('users');
        $num = $users->where(array('openid' => $openid))->count();
        if ($num == 0) {
            $data = array(
                'openid' => $openid,
                'nickname' => $nickname,
                'avatar' => urldecode(I('get.headimgurl', '')),
            );
            $req = array(
                'token' => 'gh_68f0a1ffc303',
                'timestamp' => '1509870994',
                'string' => 'ghjklkjh',
                'secret' => 'e5678834a084914e9362181b40ca60675a82bea2',
                'openid' => $openid
            );
            $ret = $this->curl_api($this->oauthDomain.'/MagicLoop/index.php?s=/addon/Api/Api/bindVerify', $req);
            if($ret['status'] == 200){
                $data['stu_id'] = $ret['stuId'] ? $ret['stuId']:'';
                $class_id = M('class')->where(array('stu_id' => $ret['stuId']))->getField('class_id');
                $data['class_id'] = $class_id ? $class_id:'';
            }
            $users->add($data);
        } else {
            $data = array();
            $img = I('get.headimgurl', '');
            $req = array(
                'token' => 'gh_68f0a1ffc303',
                'timestamp' => '1509870994',
                'string' => 'ghjklkjh',
                'secret' => 'e5678834a084914e9362181b40ca60675a82bea2',
                'openid' => $openid
            );
            $ret = $this->curl_api($this->oauthDomain.'/MagicLoop/index.php?s=/addon/Api/Api/bindVerify', $req);
            if($ret['status'] == 200){
                $data['stu_id'] = $ret['stuId'] ? $ret['stuId']:'';
                $class_id = M('class')->where(array('stu_id' => $ret['stuId']))->getField('class_id');
                if (APP_DEBUG) {
                    $class_id = '12011501';
                }
                $data['class_id'] = $class_id ? $class_id:'';
                $users->where(array('openid' => $openid))->save($data);
            }
            if ($nickname && $img != '') {
                $data['nickname'] = $nickname;
                $data['avatar'] = urldecode($img);
                $users->where(array('openid' => $openid))->save($data);
            }
        }
    }


    /*curl通用函数*/
    protected function curl_api($url, $data=''){
        // 初始化一个curl对象
        $ch = curl_init();
        curl_setopt ( $ch, CURLOPT_URL, $url );
        curl_setopt ( $ch, CURLOPT_POST, 1 );
        curl_setopt ( $ch, CURLOPT_HEADER, 0 );
        curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, 1 );
        curl_setopt ( $ch, CURLOPT_POSTFIELDS, $data );
        // 运行curl，获取网页。
        $contents = json_decode(curl_exec($ch), true);
        // 关闭请求
        curl_close($ch);
        return $contents;
    }
}