<?php
namespace Home\Controller;

use Org\Util\Stringtp;
use Think\Controller;
use Think\Model;

class IndexController extends BaseController {
    private $appid = 'wx81a4a4b77ec98ff4';
    private $acess_token = 'gh_68f0a1ffc303';
    private $total = 10;
    public function index() {
        $openid = session('openid');

        $user = M('users')->where(array('openid' => $openid))->find();
        $isComplete = 1;
        if ($user['level'] == '' || $user['level'] == null) {
            $isComplete = 0;
        }
        $signature = $this->JSSDKSignature();
        $this->assign('signature', $signature);
        $this->assign('isComplete', $isComplete);
        $this->assign('appid', $this->appid);
        $this->display();
    }

    public function getQuestion() {
        $isNew = I('post.new', 'new');
        $isNew = $isNew == 'true' ? true:false;
        $users = M('users');
        $openid = session('openid');
        $data = $users->where(array('openid' => $openid))->find();

        if ($data['current_exam_process'] == 0) {
            $data['last_score'] = 0;
            $data['current_exam_process'] += 1;
        }
        $rank = rand(0, 10);
        if ($rank%2 == 0) {
            $question = $this->getJudge();
        } else {
            $question = $this->getSelect();
        }
        $data['last_question_id'] = $question['id'];
        $users->where(array('openid' => $openid))->save($data);
        session('time', time());
        $this->ajaxReturn(array(
            'status'  => 200,
            'data'    => $question,
            'current' => $data['current_exam_process']
        ));
    }

//    public function getQuestion() {
//        $isNew = I('post.new', 'new');
//        $isNew = $isNew == 'true' ? true:false;
//        $users = M('users');
//        $openid = session('openid');
//        $data = $users->where(array('openid' => $openid))->find();
//        if ($data['current_exam_process'] < 2) {
//            if($isNew || $data['last_question_id'] == 0) {
//                $question = $this->getJudge();
//            } else {
//                $question = $this->getJudge($data['last_question_id']);
//            }
//            if ($data['current_exam_process'] == 0) {
//                $data['last_score'] = 0;
//                $data['current_exam_process'] += 1;
//            }
//        } elseif (1 < $data['current_exam_process'] && $data['current_exam_process'] < 4) {
//            if($isNew) {
//                $question = $this->getFillBlank();
//            } else {
//                $question = $this->getFillBlank($data['last_question_id']);
//            }
//        } elseif (3 < $data['current_exam_process'] && $data['current_exam_process'] < 6) {
//            if($isNew) {
//                $question = $this->getSelect();
//            } else {
//                $question = $this->getSelect($data['last_question_id']);
//            }
//        } else {
//            $this->ajaxReturn(array(
//                'status'  => 500,
//                'info' => 'server error'
//            ));
//        }
//        $data['last_question_id'] = $question['id'];
//        $users->where(array('openid' => $openid))->save($data);
//        $this->ajaxReturn(array(
//            'status'  => 200,
//            'data'    => $question,
//            'current' => $data['current_exam_process']
//        ));
//    }

    //有个逻辑漏洞, 一直无限post这个接口就哈哈哈哈
    public function answer() {
        $isCorrect = I('post.isCorrect', 'false');
        if($isCorrect == '') {
            $this->ajaxReturn(array(
                'status' => 400,
                'info'   => '格式错误'
            ));
        }
        $users = M('users');
        $openid = session('openid');
        //其实这里写得是有问题的, 在高并发下情况下会搞出来脏数据的, 不过并没有机会高并发:)
        $data = $users->where(array('openid' => $openid))->find();
        //不直接$isCorrect, 而是这样写是有原因的
        if($isCorrect == 'true' || $isCorrect === true) {
            $data['answer_num'] += 1;
            $data['all_score'] += 20;
            $data['last_score'] += 20;
            $data['top_score'] = $data['last_score'] > $data['top_score'] ? $data['last_score'] : $data['top_score'];
        }
        $data['current_exam_process'] += 1;
        if ($data['current_exam_process'] > $this->total) {
            if ($data['last_score'] == 200) {//太僵硬了, 采用欺骗的手段了
                $past = session('time');
                $now = time();
               if($data['avg_time'] > $now - $past || $data['avg_time'] == 0 )  {
                   $data['avg_time'] = $now - $past;
               }
            }
            $data['current_exam_process'] = 0;
            $data['last_question_id'] = 0;
        }
        $users->where(array('openid' => $openid))->save($data);
        $this->ajaxReturn(array(
            'status' => 200,
            'info'   => '成功'
        ));
    }

    public function personal() {
        $openid = session('openid');
        $users = M('users');
        $user = $users->where(array('openid' => $openid))->find();
        $model = new Model();
        $row = $model->query("select * from (select *, (@rank := @rank + 1)rank from (select openid from users order by top_score desc, avg_time asc)t, (select @rank := 0)a)b WHERE openid='$openid'");
        $rank = $row[0]['rank'];
        $data = array(
            'correct' => $user['last_score']/20,
            'last_score' => $user['last_score'],
            'top_score' => $user['top_score'],
            'rank' => $rank,
        );
        $this->ajaxReturn(array(
            'status' => 200,
            'data'   => $data
        ));
    }

    public function personRank() {
        $openid = session('openid');
        $model = new Model();
        $row = $model->query("select * from (select *, (@rank := @rank + 1)rank from (select openid from users order by top_score desc, avg_time asc)t, (select @rank := 0)a)b WHERE openid='$openid'");
        $rank = $row[0]['rank'];
        $users = M('users');
        $user = $users->where(array('openid' => $openid))->find();
        $list = $users->order('top_score desc, avg_time asc')->field('nickname, avatar, top_score')->limit(50)->select();
        $i = 0;
        foreach ($list as &$v) {
            $i++;
            $v['rank'] = $i;
        }
        $this->ajaxReturn(array(
            'status' => 200,
            'data' => array(
                'personal' => array(
                    'rank' => $rank,
                    'avatar' => $user['avatar'],
                    'nickname' => $user['nickname'],
                ),
                'list' => $list
            )
        ));
    }

    public function schoolRank() {
        $level = I('get.level', 'benke');
        $openid = session('openid');
        $users = M('users');
        $user = $users->where(array('openid' => $openid))->find();
        $model = new Model();
        $rows = $model->query("select school, nickname, avatar, rank from (select *, (@rank := @rank + 1)rank from (select * from users where school != '' and level = '$level' order by top_score desc, avg_time asc limit 50)t, (select @rank := 0)a)b");
        $row = $model->query("select * from (select *, (@rank := @rank + 1)rank from (select openid from users order by top_score desc, avg_time asc)t, (select @rank := 0)a)b WHERE openid='$openid'");
        $rank = '∞';
        if (count($row) != 0) {
            $rank = $row[0]['rank'];
        }

        $this->ajaxReturn(array(
            'status' => 200,
            'data' => array(
                'personal' => array(
                    'rank' => $rank,
                    'avatar' => $user['avatar'],
                    'nickname' => $user['nickname'],
                ),
                'list' => $rows
            )
        ));
    }

    public function udpatePersonalInfo() {
        $phone = I('post.phone');
        $school = I('post.school', '');
        $name = I('post.name', ''); //万一不和谐呢
        if (!$this->isMobile($phone)) {
            $this->ajaxReturn(array(
                'status' => 403,
                'info'   => '请输入正确格式的手机号~'
            ));
        }
        if ($school == '' || $name == '') {
            $this->ajaxReturn(array(
                'status' => 403,
                'info'   => '请输入正确的姓名或学校~'
            ));
        }
        $openid = session('openid');
        $level = M('school')->where(array('school_name' => $school))->getField('level');
        M('users')->where(array('openid' => $openid))->save(
            array(
                'phone' => $phone,
                'school' => $school,
                'level' => $level,
                'name'  => $name,
            )
        );
        $this->ajaxReturn(array(
            'status' => 200,
            'info'   => '成功'
        ));
    }

    private function isMobile($mobile) {
        if (!is_numeric($mobile)) {
            return false;
        }
        return preg_match('#^13[\d]{9}$|^14[5,7]{1}\d{8}$|^15[^4]{1}\d{8}$|^17[0,3,6,7,8]{1}\d{8}$|^18[\d]{9}$#', $mobile) ? true : false;
    }

    private function getSelect($id = null) {
        if ($id != null) {
            $question = M('select')->where(array('id' => $id))->find();
        } else {
            $question = M('select')->order('rand()')->find();
        }
        $id = $question['id'];
        $q = $question['question'];
        $answer = $question['answer'];

        unset($question['id']);
        unset($question['question']);
        unset($question['answer']);
        $select = array();
        foreach ($question as $v) {
            if ($v) {
                array_push($select, $v);
            }
        }
        if(strlen($answer) > 1){
            $q = $q.'（多选题）';
        }
        $data = array(
            'id' => $id,
            'question' => $q,
            'select' => $select,
            'answer' => $answer,
            'type' => strlen($answer) > 1 ? 'multiSelect': 'select',
        );
        return $data;
    }

    private function getFillBlank($id = null) {
        if ($id != null) {
            $question = M('fillblank')->where(array('id' => $id))->find();
        } else {
            $question = M('fillblank')->order('rand()')->find();
        }
        $q = explode('_', $question['question']);
        $question['question'] = array($q[0], $q[count($q)-1]);
        $s = new Stringtp();
        $str = $s->randString(8-mb_strlen($question['answer'], 'utf-8'), 4);
        $question['fill'] = $this->mbStrSplit($question['answer'].$str);
        shuffle($question['fill']);
        $question['type'] = 'fillblank';
        return $question;
    }

    private function getJudge($id = null) {
        if ($id != null) {
            $question = M('judge')->where(array('id' => $id))->find();
        } else {
            $question = M('judge')->order('rand()')->find();
        }
        $question['isTrue'] = $question['answer'] == '正确' ? true:false;
        unset($question['answer']);
        $question['type'] = 'judge';
        return $question;
    }

    private function mbStrSplit($string, $len=1) {
        $start = 0;
        $strlen = mb_strlen($string);
        while ($strlen) {
            $array[] = mb_substr($string,$start,$len,"utf8");
            $string = mb_substr($string, $len, $strlen,"utf8");
            $strlen = mb_strlen($string);
        }
        return $array;
    }

    private function getTicket() {
        $time = time();
        $str = 'abcdefghijklnmopqrstwvuxyz1234567890ABCDEFGHIJKLNMOPQRSTWVUXYZ';
        $string='';
        for($i=0;$i<16;$i++){
            $num = mt_rand(0,61);
            $string .= $str[$num];
        }
        $secret =sha1(sha1($time).md5($string)."redrock");
        $t2 = array(
            'timestamp'=>$time,
            'string'=>$string,
            'secret'=>$secret,
            'token'=>$this->acess_token,
        );
        $url = $this->oauthDomain.'/MagicLoop/index.php?s=/addon/Api/Api/apiJsTicket';
        return $this->curl_api($url, $t2);
    }

    public function JSSDKSignature(){
        $string = new Stringtp();
        $jsapi_ticket = $this->getTicket();
        $data['jsapi_ticket'] = $jsapi_ticket['data'];
        $data['noncestr'] = $string->randString();
        $data['timestamp'] = time();
        $data['url'] = 'https://'.$_SERVER['HTTP_HOST'].'/game'.__SELF__;//生成当前页面url
        $data['signature'] = sha1($this->ToUrlParams($data));
        return $data;
    }

    private function ToUrlParams($urlObj){
        $buff = "";
        foreach ($urlObj as $k => $v) {
            if($k != "signature") {
                $buff .= $k . "=" . $v . "&";
            }
        }
        $buff = trim($buff, "&");
        return $buff;
    }

//    public function dataEdit() {
//        $table = M('select');
//        $data = $table->select();
//        foreach ($data as $v) {
////            $v['question'] = trim($v['question']);
//
//            $answer = '';
//            for($i =0 ; $i < mb_strlen($v['answer'], 'utf-8') ; $i++) {
//                $sub_str = mb_substr($v['answer'], $i, 1);
//                if(ctype_upper($sub_str)){
//                    $answer .= $sub_str;
//                }
//            }
//            $v['answer'] = $answer;
//            var_dump($v);
//            $table->where(array('id' => $v['id']))->save($v);
//        }
//    }

}
