
; /* Start:"a:4:{s:4:"full";s:54:"/local/templates/crabbit/js/callback.js?15113560006348";s:6:"source";s:39:"/local/templates/crabbit/js/callback.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
$(document).ready(function () {

	function fileAdd(e) {
		console.log(e.target.value);
		var self = this;
		[].forEach.call(this.files, function(el) {
			if ( (el.size/1024/1024) > self.dataset.maxSize ) return;
			var newInp = document.createElement("input");
			newInp.type = "file";
			newInp.name = self.name;
			newInp.dataset.maxsize = self.dataset.maxsize;
			newInp.onchange = fileAdd;
			self.parentElement.appendChild(newInp);
			self.style.display = "none";
			self.name = el.name;
			var html = "<li><i class=\"fa fa-times fa-1\" aria-hidden=\"true\"></i><span class='element-file'>" + el
					.name +
				"</span></li>";
			var elHtml = htmlToElements(html)[0];
			elHtml.querySelector(".fa").onclick = fileDelete;
			self.parentElement.nextElementSibling.appendChild(elHtml);
			self.parentElement.nextElementSibling.appendChild(self);
		})
	}
	function fileDelete(e) {
		var name = this.parentElement.innerText.trim();
		this.parentElement.parentElement.querySelector("input[name=\"" + name + "\"]").remove();
		this.parentElement.remove();
	}
	function htmlToElements(html) {
		var template = document.createElement('template');
		template.innerHTML = html;
		return template.content.childNodes;
	}
	function formReset(form) {
		form.reset();
		form.querySelector(".file-list").innerHTML = "";
	}
	document.querySelector(".lead-form input[name=fileFake]").onchange = fileAdd;

	$('#popup-form').popup({
		openelement: '.modal-btn',
		transition: 'all 0.3s'
	});

	$("form.lead-form").submit(function (e) {
		e.preventDefault();
		var fields = {};
		var $this = $(this);
		var $arParams = {};
		$arParams['FILE'] = 'N';
		$arParams['POPUP'] = 'N';
		if ($this.attr('data-file') === 'Y') {
			$arParams['FILE'] = 'Y';
		}
		if ($this.attr('data-popup') === 'Y') {
			$arParams['POPUP'] = 'Y';
		}

		if($this.closest('.inquiry').find('.conf-info').length) {
			var arOption =[];
			var confObj = $this.closest('.inquiry').find('.conf-info');
			confObj.find('.conf-info__field').each(function () {
				var currentOption = {};
				if($(this).find('.conf-info__value').attr('id') !== 'conf-info_opt') {
					currentOption.name = $(this).find('.conf-info__property').text();
					currentOption.value = $(this).find('.conf-info__value').text();
				} else {
					currentOption.name = $(this).find('.conf-info__property').eq(0).text();
					currentOption.value = '';
				}
				arOption.push(currentOption);
			});
			fields.options = arOption;
		}
		var input = $this.find('input'),
			textarea = $this.find('textarea'),
			email = $this.find('[name = user_email]'),
			check = true;

		if($this.find('.label-iagree').size()) {
			if ($this.find('.iagree').prop('checked') == false) {
				$this.find('.label-iagree').addClass('error-lead-form-label');
				check = false;
			} else {
				$this.find('.label-iagree').removeClass('error-lead-form-label');
			}
		}
		input.each(function () {
			var currentField = {};
			currentField.name = $(this).attr('name');
			currentField.value = $(this).val();
			fields[currentField.name] = currentField.value;
			$(this).removeClass("error-lead-form");
			$(this).next().removeClass("error-lead-form-label");
			if ($(this).parent().hasClass('required') && $(this).val() === '') {
				$(this).addClass("error-lead-form");
				$(this).next().addClass("error-lead-form-label");
				check = false;
			}
		});

		textarea.each(function () {
			if ($(this).prop('required') && $(this).val() === '') {
				$(this).addClass("error");
				check = false;
			}
		});

		if(email.length) var emailVal = email.val().trim();

		if(email.length) {
			if (!(emailVal.length >= 6 && emailVal.includes('@') && emailVal.includes('.'))) {
				email.addClass("error-lead-form");
				email.next().addClass("error-lead-form-label");
				check = false;
			} else {
				email.removeClass("error-lead-form");
				email.next().removeClass("error-lead-form-label");
			}
		}
		function past_block(target, buttons, hide_block, func) {
			var inner_function = function(e) {
				if (buttons === '') buttons = $('#000000000');
				if (!target.is(e.target) && target.has(e.target).length === 0 && !buttons.is(e.target)) {
					if(func !== undefined) {
						func();
					} else {
						hide_block.removeClass('open');
					}

				}
			};
			$(document).bind('touchmove', function (e) {
				inner_function(e);
			}).bind('mouseup',function (e) {
				inner_function(e);
			}).bind('touchend',function (e) {
				inner_function(e);
			}).click(function (e) {
				inner_function(e);
			});
		}
		if(check) {
			var data = new FormData($this.get(0));
			if(typeof(arOption) == 'object' && arOption.length){
				var currentOptions = JSON.stringify(arOption);
				data.append('options',currentOptions);
			}
			data.append('ajax','yes');
			data.append('submit','yes');
			$.ajax({
				url: POST_FORM_ACTION_URL,
				cache: false,
				contentType: false,
				processData: false,
				type: 'POST',
				data: data,
				dataType: 'json',
				success: function (data) {
				if ($arParams["POPUP"] == 'Y') {
						$this.addClass('form-hide');
						$this.parent().find('.success__block').removeClass('success__block_hide');
					if($arParams["FILE"] == "Y") {
							setTimeout(function () {
								formReset($this.get(0));
							}, 750);
						} else {
							setTimeout(function () {
								$this.get(0).reset();
							}, 750);
						}
						var close_popup = function () {
							setTimeout(function () {
								$this.removeClass('form-hide');
								$this.parent().find('.success__block').addClass('success__block_hide');
							}, 1500);
						};
						past_block($('#popup-form').find('.form__box'),'', $this.find('.form-cover'), close_popup);
					} else {
						$this.find('.form-cover').addClass('open');
						setTimeout(function () {
							$this.get(0).reset();
						}, 750);
						past_block($this.find('.form__box'),'', $this.find('.form-cover'));
					}
				},
				error: function (err) {
					console.log("Ошибка:");
					console.log(this.data);
					console.log(err);
				}
			});
		}
	});
	$("#phone-form").mask("+7 (999) 999-99-99");
	$(".lead-form input").blur(function () {
		var elem = $(this);
		if (elem.hasClass("error-lead-form")) {
			if (elem.find("input").val() != "") {
				elem.removeClass("error-lead-form");
				elem.siblings().removeClass("error-lead-form-label");
			}
		}
		return true;
	});
});
/* End */
;; /* /local/templates/crabbit/js/callback.js?15113560006348*/
