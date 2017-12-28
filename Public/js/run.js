/**
 * Created by Zain on 6/11/2017.
 */

var prefix = "/19thTuanShiWei";
var questionLink = prefix + "/Home/Index/getQuestion";
var answerLink = prefix + "/Home/Index/answer";
var personalLink = prefix + "/Home/Index/personal";
var rankLink = prefix + "/Home/Index/personRank";
var universityrankLink = prefix + "/Home/Index/schoolRank?level=benke";
var collegerankLink = prefix + "/Home/Index/schoolRank?level=zhuanke";

function fillQuestion(data,qc,ops,ops_sell){
    for(var i = 0 ; i < ops.length ; i++){
        ops[i].css('display','none');
    }
    switch(data.type){
        case 'judge':
            var q = new TrueFlase();
            q.init(data.question,qc,data.isTrue,ops[0],data.reason,data.type);
            q.fill();
            return q;
        case 'fillblank':
            var q = new FillBlank();
            q.init(data.question,data.answer,qc,ops_sell[1],data.fill,ops[1],data.type);
            q.fill();
            return q;
        case 'select':
            var q = new Choice();
            q.init(0,qc,data.answer,data.question,data.select,ops_sell[2],ops[2],data.type);
            q.fill();
            return q;
        case 'multiSelect':
            var q = new Choice();
            q.init(1,qc,data.answer,data.question,data.select,ops_sell[2],ops[2],data.type);
            q.fill();
            return q;
        default:
            alert('error!');
    }
}
$(function(){
    console.log($(window).height());
    var startBtn = $('.startBtn');
    var start_flag = false;
    var apply_flag = false;
    var qc = $('.questionContainer');
    var operators = [$('.TrueFalse'),$('.FillBlank'),$('.MultipleChoice')];
    var q_now = null;
    var judge_btn = operators[0].find('.selection');
    var fill_sell = $('.FillSelections').find('li');
    var apply_btn = $('.applyBtn');
    var current = 1;
    var ops_sell = ['',fill_sell,$('.selections').find('.selection')];
    var fill_flag = 0;
    var fill_box = null;
    var chose_btn = $('.selections').find('li');
    var right_num = $('.right_num');
    var score_s = $('.score_s');
    var score_c = $('.score_c');
    var person_rank_num = $('.rank_num');
    var ReplayBtn = $('.ReplayBtn');
    var user_avatar = $('.user_avatar');
    var ranknum = $('.ranknum');
    var RankBtn = $('.RankBtn');
    var uRankBtn = $('.universityRank');
    var cRankBtn = $('.collegeRank');
    var nickname = $('.nickname');
    var judged = null;
    var filled = [];
    var QuestionType = $('.QuestionType');
    var Description = $('.Description');
    var ranks = $('.list_rank');
    var uranks = $('.list_urank');
    var cranks = $('.list_crank');
    var top3 = ranks.find('li');
    var utop3 = uranks.find('li');
    var ctop3 = cranks.find('li');
    var rankBtn_flag = 0;
    var urankBtn_flag = 0;
    var crankBtn_flag = 0;
    var rank_load = 0;
    var urank_load = 0;
    var crank_load = 0;
    var returnHome = $('.returnHome');
    var personalRank = $('.personalRank');
    var saveTop3 = ranks.html();
    var usaveTop3 = uranks.html();
    var csaveTop3 = cranks.html();
    var closeP = $('.closeP');
    var mask = $('.mask');
    var programerHolder = $('.programerHolder');
    var d_btn = $('.developer_btn');
    var return_home = $('.return_home');
    return_home.on('click',function(){
        console.log(2);
        $.mobile.changePage('#homePage',{
            transition:'slide'
        })
    });
    d_btn.on('click',function(){
       mask.css('display','block');
       programerHolder.css('display','block');
    });
    closeP.on('click',function(){
        mask.css('display','none');
        programerHolder.css('display','none');
    });
    personalRank.on('click',function(){
        $.mobile.changePage('#rankPage',{
            transition:'flow'
        })
    });
    returnHome.on('click',function(){
        $.mobile.changePage('#homePage',{
            transition:'flow'
        })
    });
    ReplayBtn.on('click',function(){
        $.mobile.changePage('#homePage',{
            transition:'flow'
        })
    });
    RankBtn.on('click',function(){
        if(rankBtn_flag){
            return false
        }
        rankBtn_flag = 1;
        $.mobile.loading('show');
        $.get(rankLink,function(data){
            $.mobile.loading('hide');
            rankBtn_flag = 0;
            if(data.status == 200){
                user_avatar.attr('src',data.data.personal.avatar);
                nickname.html(data.data.personal.nickname);
                ranknum.html(data.data.personal.rank);
                if(rank_load){
                    ranks.html("");
                    ranks.html(saveTop3);
                    top3 = ranks.find('li');
                    for(var i = 0 ; i < data.data.list.length ; i++){
                        if(i<3){
                            top3.eq(i).find('.list_avatar').attr('src',data.data.list[i].avatar);
                            top3.eq(i).find('.list_nickname').html(data.data.list[i].nickname);
                        }else{
                            if(i%2 == 0){
                                ranks.append('<li style="background: #feebcb"> <img src="'+data.data.list[i].avatar+'" alt="" class="list_avatar"> <span class="list_nickname">'+data.data.list[i].nickname+'</span> <span class="list_ranknum">'+data.data.list[i].rank+'</span> </li>');
                            }else{
                                ranks.append('<li> <img src="'+data.data.list[i].avatar+'" alt="" class="list_avatar"> <span class="list_nickname">'+data.data.list[i].nickname+'</span> <span class="list_ranknum">'+data.data.list[i].rank+'</span> </li>');
                            }
                        }
                    }
                    $.mobile.changePage('#rankPage',{
                        transition: 'flow'
                    });
                    return false;
                }else{
                    for(var i = 0 ; i < data.data.list.length ; i++){
                        if(i<3){
                            top3.eq(i).find('.list_avatar').attr('src',data.data.list[i].avatar);
                            top3.eq(i).find('.list_nickname').html(data.data.list[i].nickname);
                        }else{
                            if(i%2 == 0){
                                ranks.append('<li style="background: #feebcb"> <img src="'+data.data.list[i].avatar+'" alt="" class="list_avatar"> <span class="list_nickname">'+data.data.list[i].nickname+'</span> <span class="list_ranknum">'+data.data.list[i].rank+'</span> </li>');
                            }else{
                                ranks.append('<li> <img src="'+data.data.list[i].avatar+'" alt="" class="list_avatar"> <span class="list_nickname">'+data.data.list[i].nickname+'</span> <span class="list_ranknum">'+data.data.list[i].rank+'</span> </li>');
                            }
                        }
                    }
                    rank_load = 1;
                }
                $.mobile.changePage('#rankPage',{
                    transition: 'flow'
                })
            }else {
                alert(data.status);
            }
        });
        $.mobile.changePage('#rankPage',{
            transition:'flow'
        })
    });


    uRankBtn.on('click',function(){
        if(urankBtn_flag){
            return false
        }
        urankBtn_flag = 1;
        $.mobile.loading('show');
        $.get(universityrankLink,function(data){
            $.mobile.loading('hide');
            urankBtn_flag = 0;
            if(data.status == 200){
                user_avatar.attr('src',data.data.personal.avatar);
                nickname.html(data.data.personal.nickname);
                ranknum.html(data.data.personal.rank);
                console.log(urank_load);
                if(urank_load){
                    uranks.html("");
                    uranks.html(usaveTop3);
                    utop3 = uranks.find('li');
                    for(var i = 0 ; i < data.data.list.length ; i++){
                        if(i<3){
                            utop3.eq(i).find('.u_name').html(data.data.list[i].school);
                        }else{
                            if(i%2 == 0){
                                uranks.append('<li style="background: #feebcb"><span class="u_name">'+data.data.list[i].school+'</span><span class="list_ranknum">'+data.data.list[i].rank+'</span></li>');
                            }else{
                                uranks.append('<li><span class="u_name">'+data.data.list[i].school+'</span><span class="list_ranknum">'+data.data.list[i].rank+'</span></li>');
                            }
                        }
                    }
                    $.mobile.changePage('#uRankPage',{
                        transition: 'flow'
                    });
                    return false;
                }else{
                    for(var i = 0 ; i < data.data.list.length ; i++){
                        if(i<3){
                            utop3.eq(i).find('.u_name').html(data.data.list[i].school);
                        }else{
                            if(i%2 == 0){
                                uranks.append('<li style="background: #feebcb"><span class="u_name">'+data.data.list[i].school+'</span><span class="list_ranknum">'+data.data.list[i].rank+'</span></li>');
                            }else{
                                uranks.append('<li><span class="u_name">'+data.data.list[i].school+'</span><span class="list_ranknum">'+data.data.list[i].rank+'</span></li>');
                            }
                        }
                    }
                    urank_load = 1;
                }
                $.mobile.changePage('#uRankPage',{
                    transition: 'flow'
                })
            }else {
                alert(data.status);
            }
        });
    });

    cRankBtn.on('click',function(){
        if(crankBtn_flag){
            return false
        }
        crankBtn_flag = 1;
        $.mobile.loading('show');
        $.get(collegerankLink,function(data){
            $.mobile.loading('hide');
            crankBtn_flag = 0;
            if(data.status == 200){
                user_avatar.attr('src',data.data.personal.avatar);
                nickname.html(data.data.personal.nickname);
                ranknum.html(data.data.personal.rank);
                if(crank_load){
                    cranks.html("");
                    cranks.html(csaveTop3);
                    ctop3 = cranks.find('li');
                    for(var i = 0 ; i < data.data.list.length ; i++){
                        if(i<3){
                            ctop3.eq(i).find('.c_name').html(data.data.list[i].school);
                        }else{
                            if(i%2 == 0){
                                cranks.append('<li style="background: #feebcb"><span class="c_name">'+data.data.list[i].school+'</span><span class="list_ranknum">'+data.data.list[i].rank+'</span></li>');
                            }else{
                                cranks.append('<li><span class="c_name">'+data.data.list[i].school+'</span><span class="list_ranknum">'+data.data.list[i].rank+'</span></li>');
                            }
                        }
                    }
                    $.mobile.changePage('#cRankPage',{
                        transition: 'flow'
                    });
                    return false;
                }else{
                    for(var i = 0 ; i < data.data.list.length ; i++){
                        if(i<3){
                            ctop3.eq(i).find('.c_name').html(data.data.list[i].school);
                        }else{
                            if(i%2 == 0){
                                cranks.append('<li style="background: #feebcb"><span class="c_name">'+data.data.list[i].school+'</span><span class="list_ranknum">'+data.data.list[i].rank+'</span></li>');
                            }else{
                                cranks.append('<li><span class="c_name">'+data.data.list[i].school+'</span><span class="list_ranknum">'+data.data.list[i].rank+'</span></li>');
                            }
                        }
                    }
                    crank_load = 1;
                }
                $.mobile.changePage('#cRankPage',{
                    transition: 'flow'
                })
            }else {
                alert(data.status);
            }
        });
    });



    startBtn.on('click',function(){
        if(start_flag){
            return false
        }
        start_flag = true;
        $.mobile.loading('show');
        $.post(questionLink,"",function(data){
            start_flag = false;
            $.mobile.loading('hide');
            if(data.status == 200){
                console.log(data.data);
                q_now = fillQuestion(data.data,qc,operators,ops_sell);
                switch (q_now.type){
                    case 'fillblank':
                        fill_box = $('.fillbox');
                        QuestionType.html('填空题');
                        Description.html("正确答案:"+q_now.answer);
                        break;
                    case 'judge':
                        QuestionType.html('判断题');
                        Description.html(q_now.reason+"&nbsp;");
                        break;
                    default:
                        QuestionType.html('选择题');
                        Description.html("正确答案:"+q_now.answer);
                }
                current = data.current;
                $.mobile.changePage('#testPage',{
                    transition:'flow'
                });
            }
        })
    });
    chose_btn.on('click',function(){
        if($(this).attr("selected-flag") == '0'){
            q_now.selected += $(this).attr('data-flag');
            $(this).css('background','#ffffff');
            $(this).attr('selected-flag','1');
        }else{
            $(this).attr('selected-flag','0');
            $(this).css('background','#fea087');
            var x = $(this).attr('data-flag');
            q_now.selected = q_now.selected.replace(x,"");
        }
    });
    judge_btn.on('click',function(){
        q_now.selected = $(this).attr('dec');
        judge_btn.css('background','#fea087');
        $(this).css('background','#ffffff');
        judged = $(this);
    });
    fill_sell.on('click',function(){
        if($(this).attr('selected-flag') == '0'){
            if(fill_flag == q_now.answer.length){
                return false;
            }
            $(this).attr('selected-flag','1');
            fill_flag += 1;
            $(this).attr('selected-order',fill_flag);
            $(this).css({'background':'#fea087','color':'#ffffff'});
            fill_box.eq(fill_flag-1).html($(this).html());
            q_now.selected += $(this).html();
            filled.push($(this));
            fill_box.eq(fill_flag-1).css('color','#fb5d32');
            console.log(q_now.selected)
        }else{
            if($(this).attr('selected-order') != fill_flag){
                return false;
            }else{
                $(this).attr('selected-flag','0');
                $(this).css({'background':'#ffffff','color':'#f88364'});
                fill_box.eq(fill_flag-1).css('color','#ffffff');
                filled.pop();
                q_now.selected = q_now.selected.substring(0,q_now.selected.length-1);
                fill_flag -= 1;
                console.log(q_now.selected)
            }
        }
    });
    apply_btn.on('click',function(){
            fill_flag = 0;
            if(apply_flag){
                return false;
            }
            apply_flag = true;
            var isRight = q_now.check();
            var _data = {};
            _data.isCorrect = isRight;

            $.post(answerLink,_data,function(data){
                if(data.status != 200){
                    alert(data.error);
                }
            });
            Description.css('visibility','visible');
            switch(q_now.type){
                case 'judge':
                    if(isRight && judged){
                        judged.css('background','#29f676');
                    }else if(!isRight && judged){
                        judged.css('background','#f13516');
                    }else{
                        if(q_now.answer == 1){
                            judge_btn.eq(0).css('background','#29f676')
                        }else{
                            judge_btn.eq(1).css('background','#29f676')
                        }
                    }
                    break;
                case 'fillblank':
                    if(isRight){
                        for(var i = 0 ; i < filled.length ; i++){
                            filled[i].css('background','#29f676');
                        }
                    }else{
                        for(var i = 0 ; i < filled.length ; i++){
                            filled[i].css('background','#f13516');
                        }
                    }
                    fill_sell.attr('selected-flag','0');
                    break;
                default:
                    if(isRight){
                        for(var i = 0 ; i < chose_btn.length ; i++){
                            if(chose_btn.eq(i).attr('selected-flag') == '1'){
                                chose_btn.eq(i).css('background','#29f676');
                            }
                        }
                    }else{
                        for(var i = 0 ; i < chose_btn.length ; i++){
                            if(chose_btn.eq(i).attr('selected-flag') == '1'){
                                chose_btn.eq(i).css('background','#f13516');
                            }
                        }
                    }
                    chose_btn.attr('selected-flag','0');
            }
            setTimeout(function(){
                $.mobile.loading('show');
                chose_btn.css('background','#fea087');
                fill_sell.css({'background':'#ffffff','color':'#f88364'});
                judge_btn.css('background','#fea087');
                Description.css('visibility','hidden');
                if(current < 5){
                    var _data = {};
                    _data.new = true;
                    $.post(questionLink,_data,function(data){
                        $.mobile.loading('hide');
                        apply_flag = false;
                        if(data.status == 200){
                            filled = [];
                            judged = null;
                            console.log(data.data);
                            q_now = fillQuestion(data.data,qc,operators,ops_sell);
                            switch (q_now.type){
                                case 'fillblank':
                                    fill_box = $('.fillbox');
                                    QuestionType.html('填空题');
                                    Description.html("正确答案:"+q_now.answer);
                                    break;
                                case 'judge':
                                    QuestionType.html('判断题');
                                    Description.html(q_now.reason+"&nbsp;");
                                    break;
                                default:
                                    QuestionType.html('选择题');
                                    Description.html("正确答案:"+q_now.answer);
                            }
                            current = data.current;
                        }else{
                            alert(data.error)
                        }
                    });
                }else{
                    $.mobile.loading('hide');
                    $.get(personalLink,function(data){
                        if(data.status == 200){
                            right_num.html(data.data.correct);
                            person_rank_num.html(data.data.rank);
                            setTimeout(function(){
                                $.mobile.changePage('#overPage',{
                                    transition:'flow'
                                });
                                apply_flag = false;
                            },100)
                        }else{
                            alert(data.error);
                        }
                    });
                }
            },2000);
    })
});