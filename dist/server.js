
const { VrpProxy, VrpTunnel } = require('@vrpjs/server');
const vRP = VrpProxy.getInterface('vRP');
const vRPclient = VrpTunnel.getInterface('vRP');
onNet("snnaples:getLetter", function () {
    let id = vRP.getUserId(source);
    let src = vRP.getUserSource(id);
     exports['GHMattiMySQL'].QueryResultAsync("SELECT * FROM scrisoare WHERE receiver = @user_id", { user_id: id }, function (rows) {
         
     emitNet("snnaples:HTMLletter",src,rows);
    });
});
onNet("snnaples:sendLetter", function (targetID,content) {
    let user_id = vRP.getUserId(source);
    let src = vRP.getUserSource(user_id);
    let _targetSrc = vRP.getUserSource(parseInt(targetID));
    if (_targetSrc != src) {
        exports['GHMattiMySQL'].QueryResultAsync("SELECT receiver FROM scrisoare WHERE receiver = @user_id", { user_id: user_id }, function (rows) {
           rows.length > 0 ? vRPclient._notify(src, `[~b~POSTA~w~] Jucatorul are cutia postala plina!`) : sendLetter(parseInt(targetID),user_id,content);
        });
        vRPclient._notify(src, "[~b~POSTA~w~] I-ai trimis o scrisoare lui ~b~" + GetPlayerName(_targetSrc));
        vRPclient._notify(_targetSrc, "[~b~POSTA~w~] ~b~" + GetPlayerName(src) + "~w~ ti-a trimis o scrisoare!");
    }
    else {
        vRPclient._notify(src, "[~b~POSTA~w~] ~r~Nu poti sa iti trimiti o scrisoare singur!");
    }
});

function sendLetter(targetID,senderID,content) {
    let receiverSrc = vRP.getUserSource(targetID);
     exports['GHMattiMySQL'].QueryAsync("INSERT into scrisoare(sender,receiver,senderName,content) VALUES(@sender,@receiver,@senderName,@content)", { sender: senderID, receiver: targetID, senderName: GetPlayerName(receiverSrc), content:  content   }, function (rows) {
    });
}

onNet("snnaples:AmCititBoss", () => {
    let user_id = vRP.getUserId(source);
    let src = vRP.getUserSource(user_id);
    exports['GHMattiMySQL'].QueryAsync("DELETE FROM scrisoare where receiver = @user_id", {user_id : user_id}, function(rows) {
        vRPclient._notify(src,"[~b~POSTA~w~] Ti-ai golit cutia postala!");
    });
});
