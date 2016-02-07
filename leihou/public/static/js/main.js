(function($){
/* start */

var g_input = {
  isValid: false,
  answear_a_ok: false,
  answear_b_ok: false,

  modal_bug_text: '',
  hongbao_code: '',
  question_code: '',
  answear_a: '',
  answear_b: '',
  description_name: '',
  description_right: '',
  description_wrong: ''
}; 

/* input length count */
inputLenCount('modal-bug-text', 200);
inputLenCount('hongbao-code', 10);
inputLenCount('question-code', 150);
inputLenCount('answear-a', 20);
inputLenCount('answear-b', 20);
inputLenCount('description-name', 20);
inputLenCount('description-right', 20);
inputLenCount('description-wrong', 20);



/* modal options */
$('.modal-trigger').leanModal({
    dismissible: true, // Modal can be dismissed by clicking outside of the modal
    opacity: .5, // Opacity of modal background
    in_duration: 200, // Transition in duration
    out_duration: 100, // Transition out duration
    ready: function() { // Callback for Modal open
        console.log(this);

    }, 
    complete: function() { // Callback for Modal close
        console.log('Closed'); 
    } 
});

/*modal content submit */
$('#modal-bug-submit').click(function(e){
  if( ! textLenValidate('modal-bug-text', 200) ) {
    return;
  }

  $.ajax({
    url: "/hongbao/report",
    method: "POST",
    data: { 
        data: $('#modal-bug-text').val()
    },
    success: function(){
        $('#modal-bug').closeModal();
    }
  });
});

/* validate and send hongbao */
$('#send-hongbao').click(function(){
    sendInfoValidate();
    g_input['time'] = new Date().getTime();

    $.ajax({
        url: "/hongbao/set",
        method: "POST",
        data: { 
            data: g_input
        },
        success: function(ret){
            console.log(ret);
            window.location = '/bao/' + ret.location + '.html#' + ret.hash;
        }
    });
});

/* ripple effect */
$(".ripple-btn").click(addRippleEffect);
function addRippleEffect(e) {
    var target = e.target;
    if (target.tagName.toLowerCase() !== 'div') {
        return ;
    }
    var rect = target.getBoundingClientRect();
    var ripple = target.querySelector('.ripple');
    if (!ripple) {
        ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + 'px';
        target.appendChild(ripple);
    }
    ripple.classList.remove('show');
    var top = e.pageY - rect.top - ripple.offsetHeight / 2 - document.body.scrollTop;
    var left = e.pageX - rect.left - ripple.offsetWidth / 2 - document.body.scrollLeft;
    ripple.style.top = top + 'px';
    ripple.style.left = left + 'px';
    ripple.classList.add('show');
    return false;
}


/* Common functions */

/* validate text length */
function textLenValidate(tarId, len) {
    var tarStr = $('#'+tarId).val();
    if (tarStr.length <= len) {
        return true;
    }
    else {
        return false;
    }
}

/* input len count */
function inputLenCount(ipnutId, maxLen) {
    var outObj = $('#'+ipnutId+'-warning');
    var inObj = $('#'+ipnutId);

    inObj.keyup(function(){
        var inLen = inObj.val().length;
        //console.log('out: '+outObj.text());
        if (inLen > maxLen) {
            outObj.css( "color", "red" );
            g_input[isValid] = false;
        }
        else {
            g_input[ ipnutId.replace(/-/g,"_") ] = inObj.val();
        }
        outObj.text("已输入" + inLen + "/" + maxLen);
        console.log(g_input);

    });


}

/* send-hongbao validate */
function sendInfoValidate() {
    g_input['answear_a_ok'] = ( 'checked' == $('#answear-a-right').val() ) ? true : false;
    g_input['answear_b_ok'] = ( 'checked' == $('#answear-b-right').val() ) ? true : false;

    if ( g_input['answear_a_ok'] || g_input['answear_b_ok'] ) {
        return;
    }
    else {
        g_input['answear_a_ok'] = ( Math.random() > 0.5 );
        g_input['answear_b_ok'] = !g_input['answear_a_ok'];

        return;  
    }
}


/** end **/
})(jQuery);

