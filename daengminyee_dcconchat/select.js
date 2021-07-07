function onConSelect(t)
{
	var selector = '#' + t.srcElement.id;
	var text = $(selector)[0].getAttribute("data-clipboard-text");
	var cb = new ClipboardJS(selector);
	
	editTextBox.value += text;
	editTextBox.select(0, editTextBox.value.length);
}

function onCutButtonClick(t)
{
	var selector = '#cut_button';
	var tag = $(selector)[0];
	tag.setAttribute("data-clipboard-text", editTextBox.value);
	editTextBox.value = '';
	var cb = new ClipboardJS(selector);
	
}

function onFilter()
{
	updateConsVisible();
}

function hasTags(con, selectedTags)
{
	if (selectedTags.length == 0)
	{
		return true;
	}
	
	return con.tags.some(t=> selectedTags.indexOf(t) > -1);
}

function toArray(obj)
{
	var array = [];
	
	for (var i = 0; i < obj.length; i++)
	{
		array[array.length] = obj[i];
	}
	
	return array;
}

function testFilter(con, filter, selectedTags)
{
	if (hasTags(con, selectedTags) == false)
	{
		return false;
	}
	
	if (filter.length == 0)
	{
		return true;
	}
	
	if (con.keywords.some(k=>k.indexOf(filter) > -1) == true)
	{
		return true;
	}
	
	return false;
}

function updateConsVisible()
{
	var filter = filterTextBox.value;
	var selectedTags = toArray($("label.tag_selected").map((n1, n2)=>n2.innerHTML));
	
	for (var i = 0; i < rawArray.length; i ++)
	{
		var raw = rawArray[i];
				
		if (testFilter(raw, filter, selectedTags) == true)
		{
			index2Tags[i].className = "lazy";
		}
		else
		{
			index2Tags[i].className = "hidden";
		}
		
	}
	
	$("img.lazy").lazyload();
}

function getTags(rawArray)
{
	var set = [];
	
	rawArray.forEach(rawItem =>
	{
		rawItem.tags.forEach(tag =>
		{
			if (set.indexOf(tag) == -1)
			{
				set[set.length] = tag;
			}
			
		});
	});
	
	return set;
}

function onLabelTagClick(d)
{
	var labelTag = d.srcElement;
	
	labelTag.classList.toggle('tag_selected');
	
	updateConsVisible();
	
	return false;
}

function init()
{
	var rawauth = document.location.href.replace("#", "?");
	var url = getParams("url", rawauth);
	var response = $.getJSON(url);

	response.complete(function()
	{
		var headerTag = $(".headerDescription")[0];
		
		if  (response.status == 200)
		{
			rawArray = response.responseJSON["dccons"];
			tags = getTags(rawArray);
			
			headerTag.innerHTML = "클릭하면 복사됩니다.";
			var headerTagsDiv = $(".headerTagsDiv")[0];
			
			tags.forEach(t=>
			{
				var labelTag = document.createElement('label');
				labelTag.className = 'button tag_button';
				labelTag.innerText = t;
				headerTagsDiv.appendChild(labelTag);
				labelTag.onclick = onLabelTagClick;
			});
			
			var consTag = $(".cons")[0];
			index2Tags = [];
	
			for (var i = 0; i < rawArray.length; i ++)
			{
				var raw = rawArray[i];
				var aTag = document.createElement('a');
				consTag.appendChild(aTag);
				aTag.outerHTML = "<a href='#none'><img title='~" + raw.keywords[0] +"' data-clipboard-text='~" + raw.keywords[0] + "' id='Con" + i + "' data-original='" +  raw.path + "'/></a>";
				
				var imgTag = $("#Con" + i)[0];
				imgTag.onclick = onConSelect;
				index2Tags[i] = imgTag;
			}
			
			updateConsVisible();
		}
		else
		{
			headerTag.innerHTML = "디씨콘 목록을 불러오는데 실패했습니다.\r\n에러 코드 : " + response.status;
		}
	});
	
}

function getParams(name, address)
{
	var url = "";
	var results = "";

	if (typeof address === 'undefined')
	{
		address = window.location.href;
	}

	url = new URL(address);

	if (typeof url.searchParams === 'undefined')
	{
		results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(address);

		if (results == null)
		{
			return null;
		}
		else
		{
			return decodeURI(results[1]) || 0;
		}

	}
	else
	{
		return url.searchParams.get(name);
	}

}

filterTextBox.oninput=onFilter;
cut_button.onclick=onCutButtonClick;
init();