$(function() {
   /* header avatar color */
   const color = ["#FF2D2D", "#FF359A", "#D200D2", "#8600FF", "#2828FF", "#0080FF", "#00CACA", "#02C874", "#00BB00", "#FFD306", "#FF9224", "	#FF5809", "	#6FB7B7", "#AD5A5A", "#7373B9", "	#AE57A4"];

   const random = Math.floor(Math.random() * color.length);
   
   $(".memberAvatar, .mobileMemberAvatar").css("background", color[random]);

  $(document).click(function(e) {
    /* header avatar menu */
    if ($(e.target).is("#avatar")) {
      /* 如果點擊頭像 則打開選單 */
      $(".memberMenu").hide();
      $(e.target).children(".memberMenu").show();
    } else if(!$(e.target).is("#avatar")
      && $("#avatar").has(e.target).length === 0) {
        $(".memberMenu").hide();
    }
  });

  $("#headerMenuIcon").click(function() {
    if ($(this).hasClass("isOpen")) {
      $("html").removeClass("fixed");
      $(this).removeClass("isOpen");
      $(".mobileHeaderMenu").removeClass("isOpen");
    } else {
      $("html").addClass("fixed");
      $(this).addClass("isOpen");
      $(".mobileHeaderMenu").addClass("isOpen");
    }
  });

  $(".logout").click(function() {
    /* 登出行為 */
  });

  /* 上傳圖片 */
  $("#updateFile").change(function(e){
    if (e.target.files && e.target.files[0]) {
      $(".upadateButtonBox").hide();
      if (e.target.files[0].size < 1048576) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#upadatePhoto').attr('src', e.target.result);
        }
        reader.readAsDataURL(e.target.files[0]);
        $(".upadatePreview").css("display", "inline-flex");
      } else {
        alert("檔案過大，請小於1MB")
      }
    }
  });

  $("#removeIcon").click(function() {
    $('#upadatePhoto').val("");
    $(".upadateButtonBox").show();
    $(".upadatePreview").css("display", "none");
  });

  /* form validation */
  /* input屬性判斷 */
  function inputValidate(that) {
    var inputValue = $(that).val();
    var inputName = $(that).prop("name");
    var inputDisabled = $(that).prop("disabled");

    isInputEmpty(inputValue, that);

    if (inputName === "email") {
      emailValidation(inputValue, that);
    } else if ((inputName === "password" || inputName === "passwordConfirm" || inputName === "oldPassword") && !inputDisabled) {
      passwordValidation(inputValue, inputName, that);
    } else if (inputName === "policy") {
      if (!$(that).prop("checked")) {
        $(that).parents(".policyBox").addClass("error");
      } else {
        $(that).parents(".policyBox").removeClass("error");
      }
    } else if (inputName === "file") {
      if (inputValue.length === 0) {
        $(that).parents(".updateBox").addClass("error");
      } else {
        $(that).parents(".updateBox").removeClass("error");
      }
    }
  }

  function selectValidation(that) {
    var selectValue = $(that).val();
    var selectDisabled = $(that).prop("disabled");

    var selectValue = $(that).val();
    if (selectValue === "" && !selectDisabled) {
      $(that).parents(".selectBox").addClass("error");
      $(that).parents(".selectRow").siblings(".errorText").text("不可為空");
    } else {
      $(that).parents(".selectBox").removeClass("error");
    }
  }

  function isInputEmpty(value, that) {
    if (value.length === 0) {
      $(that).parents(".inputBox").addClass("error");
      $(that).parents(".inputRow").removeClass("hasText").siblings(".errorText").text("不可為空");
    } else {
      $(that).parents(".inputBox").removeClass("error");
      $(that).parents(".inputRow").addClass("hasText");
    }
  }

  function emailValidation(value, that) {
    var mailValidation = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}.([a-zA-Z]{2,3}||null)$/;
    if (value.length === 0) {
      isInputEmpty(value, that);
    } else if (!mailValidation.test(value)) {
      $(that).parents(".inputBox").addClass("error");
      $(that).parents(".inputRow").siblings(".errorText").text("信箱格式有誤");
    } else {
      $(that).parents(".inputBox").removeClass("error");
    }
  }

  function passwordValidation(value, name, that) {
    if (name === "password" || name === "oldPassword") {
      var mailValidation = /^(?=.*\d)(?=.*[a-z]).{8,20}$/;
      if (value.length === 0) {
        isInputEmpty(value, that);
        if (name === "oldPassword") {
          $("input[name='password'], input[name='passwordConfirm']").prop("disabled", true);
        }
      } else if (!mailValidation.test(value) || value.length < 8) {
        $(that).parents(".inputBox").addClass("error");
        $(that).parents(".inputRow").siblings(".errorText").text("密碼格式有誤，請包含數字及英文，長度大於7");
      } else {
        $(that).parents(".inputBox").removeClass("error");
        $("input[name='password'], input[name='passwordConfirm']").prop("disabled", false);
      }
      /* 避免語言密碼相同 */
      if ($(".form").has("input[name='oldPassword']").length > 0) {
        if (name === "password" && value === $("input[name='oldPassword']").val()) {
          $(that).parents(".inputBox").addClass("error");
          $(that).parents(".inputRow").siblings(".errorText").text("密碼不可語原密碼相同");
        } else if (name === "password" && value !== $("input[name='oldPassword']").val() && value !== "") {
          $(that).parents(".inputBox").removeClass("error");
        }
      }
    } else if (name === "passwordConfirm") {
      if (value.length === 0) {
        isInputEmpty(value, that);
      } else if (value === $("input[name='password']").val()) {
        $(that).parents(".inputBox").removeClass("error");
      } else {
        $(that).parents(".inputBox").addClass("error");
        $(that).parents(".inputRow").siblings(".errorText").text("密碼不符");
      }
    }
  }


  $("input").blur(function() {
    inputValidate(this);
  });

  $("select").change(function() {
    var selectValue = $(this).val();
    var selectName = $(this).prop("name");

    if (selectName === "school" && selectValue !== "") {
      $("select[name='dept']").prop("disabled", false);
    } else if (selectName === "school") {
      $("select[name='dept']").prop("disabled", true).val("").parents(".selectBox").removeClass("error");
    }
  });

  $("select").blur(function() {
    selectValidation(this);
  });

  /* submit event */
  $("button[name='signUp'], button[name='logIn'], button[name='sendPassword'], button[name='resetPassword'], button[name='addMember'], button[name='editMember'], button[name='addAdmin'], button[name='editAdmin']").click(function() {
    $("input").each(function() {
      var inputValue = $(this).val();
      var inputName = $(this).prop("name");
      var inputDisabled = $(this).prop("disabled");

      if ((inputName === "password" || inputName === "passwordConfirm" || inputName === "oldPassword") && !inputDisabled) {
        passwordValidation(inputValue, inputName, this);
      } else if(inputName === "email") {
        emailValidation(inputValue, this);
      } else {
        inputValidate(this);
      }
    });

    $("select").each(function() {
      selectValidation(this);
    });

    if ($(this).prop("name") === "signUp" || $(this).prop("name") === "addAdmin" || $(this).prop("name") === "editAdmin") {
      /* policy確認 */
      $("input").each(function() {
        selectValidation(this);
      });
    }

    if ($(".form").has(".error").length === 0) {
      /* submit */
      setTimeout(() => {
        alert("submit")
      }, 500);
    }
  });
  
});