/**
 * Created by Zain on 27/12/2017.
 */
$(function(){
    var li_holder = $('.li_holder');
    var startPos;
    var seletor_trigger = $('.seletor_trigger');
    var school_list = $('.school_list');
    var aLi = li_holder.find('li');
    var h = 60*36+5;
    var usr_school = $('.usr_school');
    var apply_info = $('.apply_info');
    var info_input = $('.info_list > li > input');
    var info_path = "";
    var close_tip = $('.close_tip');
    var tip_box = $('.tip_box');
    close_tip.on('click',function(){
       tip_box.hide();
        $.mobile.changePage('#homePage',{
            transition:'flow'
        });
    });
    apply_info.on('click',function(){
        $.mobile.loading('show');
        var _data = {};
        _data.name = $('.usr_name').val();
        _data.school = $('.usr_school').val();
        _data.phone = $('.usr_phone').val();
        for(var index in _data){
            if(_data[index].length == 0){
                $.mobile.loading('hide');
                alert("请把信息补充完整再提交!");
                return false;
            }
        }
        $.post(info_path,_data,function(data){
            $.mobile.loading('hide');
            if(data.status == 200){
                tip_box.show();
                $('.usr_name').val("");
                $('.usr_school').val("");
                $('.usr_phone').val("");
            }else{
                alert(data.status);
            }
        })
    });
    seletor_trigger.on('click',function(){
        if(school_list.css('display') == 'block'){
            school_list.hide();
        }else{
           school_list.show();
        }
    });
    aLi.on('click',function(){
        usr_school.val($(this).html());
        school_list.hide();
    });
    li_holder[0].addEventListener('touchstart',function(e){
        var touch = e.touches[0];
        startPos = touch.pageY;
    });
    li_holder[0].addEventListener('touchmove',function(e){
        e.preventDefault();
        var touch = event.touches[0];
        var y = (touch.pageY - startPos);
        startTop = parseInt(li_holder.css('top'));
        if(startTop + y >= 0){
            li_holder.css('top',0);
        }else if(startTop + y <= -h){
            li_holder.css('top',-h);
        }else{
            li_holder.css('top',startTop + y);
            startPos += y;
        }
    });
});