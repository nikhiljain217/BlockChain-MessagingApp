App = {
	loading:false,
	contracts: {

	},

	load: async() => {
		await App.loadWeb3()
		await App.loadAccount()
		await App.loadContract()
		await App.render()
	},

  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
  	App.account = web3.eth.accounts[0]
  },

  loadContract: async () => {
  	const message = await $.getJSON('Messages.json')
  	App.contracts.Messages = TruffleContract(message)
  	App.contracts.Messages.setProvider(App.web3Provider)
  	
  	App.message = await App.contracts.Messages.deployed()


  },

  render: async () => {
  	if(App.loading){
  		return
  	}
  	App.setLoading(true)

  	$('#account').html(App.account)
    App.renderContacts()
  	App.renderMessages()

  	App.setLoading(false)
  },

  setLoading: (boolean) => {
  	App.loading = boolean
  	const loader = $('#loader')
  	const content = $('#content')
  	if(boolean)
  	{
  		loader.show()
  		content.hide()
  	}
  	else
  	{
  		loader.hide()
  		content.show()	
  	}
  },

  renderMessages: async () =>{
  	const messageCount = await App.message.messageCount()
  	const $messageTemplate = await $('.sent')

  	$('#messageList').empty()

  	for(var i = 1;i <= messageCount;i++)
  	{
  		const message = await App.message.messages(i)
  		const messageId = message[0].toNumber
  		const sender = message[1]
  		const content = message[2]
  		const $newMessageTemplate = $messageTemplate.clone()
  		
  		$newMessageTemplate.find('div.sender').html(sender)
      $newMessageTemplate.find('p.content').html(content)
  		$('#messageList').append($newMessageTemplate)
  		$newMessageTemplate.show()
  	}

	},

  renderContacts: async () =>{
    const contactCount = await App.message.participantCount()
    const $contactTemplate = await $('.contact')
    $('#contactList').empty()
    for(var i = 1;i <= contactCount;i++)
    {
      const participant = await App.message.participants(i);
      const contactID = participant[0].toNumber
      const contact = participant[1]
      const $newContactTemplate = $contactTemplate.clone()
      $newContactTemplate.find('p.name').html(contact)

      $('#contactList').append($newContactTemplate)
      $newContactTemplate.show()
    }
  },
	addMessages: async () =>{
		App.setLoading(true)
		const content = $('#newMessage').val()
		const user = $.cookie("user");
    alert(user)
		await App.message.addMessage(content,user)
		window.location.reload()
	},


  

	setCookie: async() =>{
		
		const userName = $('#userName').val()
		$.cookie('user',userName)
    console.log($.cookie("user"))
    await App.message.addParticipant(userName)  
		window.location.replace("http://127.0.0.1:3000/index3.html")

	}
  	
}

$(() => {
	$(window).load(() => {
		App.load()
	})
})

