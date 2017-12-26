/**
 * Created by Zain on 27/12/2017.
 */
$(function(){
    var li_holder = $('.li_holder');
    var startPos;
    var seletor_trigger = $('.seletor_trigger');
    var school_list = $('.school_list');
    var aLi = school_list.find('li');
    var h = 16*36+5;
    var usr_school = $('.usr_school');
    seletor_trigger.on('click',function(){
        if(school_list.css('display') == 'block'){
            school_list.hide();
        }else{
           school_list.show();
        }
    });
    aLi.on('click',function(){
        usr_school.val($(this).html());
        console.log(1);
    });
    li_holder[0].addEventListener('touchstart',function(e){
        e.preventDefault();
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