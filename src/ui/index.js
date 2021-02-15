$(function () {
	window.onload = (e) => {
		window.addEventListener('message', (event) => {

			

			var item = event.data;
			if(item.type == "open") {
				$("#no").hide()
				const monthNames = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie","Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];
				const days = ["Duminica", "Luni", "Marti", "Miercuri", "Joi", "Vineri", "Sambata"];
				let date = new Date();
				$("#read").click( () => {
					$("#body").hide();
					$.post('http://sn_letter/deleteLetter', JSON.stringify({
					event: "delete"
					}));
				});
					$("#send").click ( () => {
						let targetID = document.getElementById("receiver-id").value;
						let content = document.getElementById("content").value;
						if(targetID.length >= 0 && content.length >= 5 && content.length <= 120 && targetID.length <= 10 && typeof parseInt(targetID) == "number") {
							$("#body").hide();
								$.post('http://sn_letter/sendLetter', JSON.stringify({
									event: "send",
									content: content,
									id: targetID
								}));
						}
					});
				$("#data").html(`${days[date.getDay()]}, ${monthNames[date.getMonth()]}, ${date.getFullYear()}`)
				$("#title").html("SNNAPLES"); // aici am lasat eu credite ca bulangiul, daca vreti sa apara numele jucatorului care foloseste meniul inlocuitit "SNNAPLES" cu item.name :)
				$("#body").show();
				$("#close-btn").click( () => {
					$("#body").hide();
					$.post('http://sn_letter/close-menu', JSON.stringify({

						event: "close-menu"
						

					}));
				});
			}

			if(item.type == "no-letters") {
				
			$("#no").show();
			$("#sender").html("From :");
				$("#your-letters").html("Mesaj:");

			
			}

			if(item.type == "update-letter") {
				
				$("#sender").html("From: " + item.senderName);
				$("#your-letters").html("Mesaj: " + item.content);
			
			}
	  
				
		

		});
	};
});



