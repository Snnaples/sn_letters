fx_version 'adamant'

game 'gta5'


dependency 'GHMattiMySQL'

ui_page 'src/ui/index.html'


webpack_config 'client.config.js'


client_scripts {

'dist/client.js'
}

server_script 'dist/server.js'

files {
    'src/ui/style.css',
    'src/ui/index.html',
'src/ui/handler.js'

}