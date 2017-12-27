/**
 * Created by Zain on 5/11/2017.
 */
$(function(){
    var w = $(window).width();
    var questionContainer = $('.questionContainer');
    var TrueFalse = $('.TrueFalse');
    var FillBlank = $('.FillBlank');
    var tip_box = $('.tip_box');
    tip_box.css('left',(w-240)/2);
    TrueFalse.css('height',w*0.4);
    FillBlank.css('height',w*0.4);
    questionContainer.css('height',w*0.58);
});