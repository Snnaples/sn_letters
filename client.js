

const postCoords = { x: -17.863634109498, y: -977.87414550782, z: 28.363622665406 };
let playerName = GetPlayerName(PlayerId());
function Delay(ms) {
    return new Promise(function (res) {
        setTimeout(res, ms);
    });
}
function notify(text) {
    SetNotificationTextEntry("STRING");
    AddTextComponentString(text);
    DrawNotification(true, false);
}
function drawInfo(text) {
    SetTextComponentFormat("STRING");
    AddTextComponentString(text);
    DisplayHelpTextFromStringLabel(0, false, true, -1);
}

onNet("snnaples:HTMLletter", function(obj) {
   
    if(obj.length > 0) {
        SendNuiMessage(JSON.stringify({
            type: "update-letter",
            name:playerName,
            senderName: obj[0].senderName,
            content: obj[0].content
        }));
    } else {
        SendNuiMessage(JSON.stringify({
            type: "no-letters"
        }));
    }
   
});

RegisterNuiCallbackType("deleteLetter");
on("__cfx_nui:deleteLetter", function(data,cb) {
emitNet("snnaples:AmCititBoss");
SetNuiFocus(false, false);
actions = false;

cb('ok');
});


RegisterNuiCallbackType("sendLetter");
on('__cfx_nui:sendLetter', function (data, cb) {
    let targetID = data.id;
    let content = data.content
    SetNuiFocus(false, false);
    actions = false;
    cb('ok');
    emitNet("snnaples:sendLetter", targetID,content);
});
RegisterNuiCallbackType("close-menu");
on('__cfx_nui:close-menu', function (data, cb) {
    SetNuiFocus(false, false);
    actions = false;
    cb('ok');
});
let actions = false;
setTick(function () {
    let playerPed = GetEntityCoords(GetPlayerPed(-1), true);
    if (GetDistanceBetweenCoords(playerPed[0], playerPed[1], playerPed[2], postCoords['x'], postCoords['y'], postCoords['z'], true) < 6) {
        DrawMarker(27, postCoords['x'], postCoords['y'], postCoords['z'], 0, 0, 0, 0, 0, 0, 0.7001, 0.7001, 0.7001, 3, 144, 252, 99, false, false, 0, true, null, null, false);
        drawInfo("[~b~POSTA~w~] Apasa ~r~E ~w~pentru a deschide meniul postei");
        if (IsControlJustPressed(1, 51)) {
            SendNuiMessage(JSON.stringify({
                type: 'open',
                name: playerName
            }));
            emitNet("snnaples:getLetter");
            SetNuiFocus(true, true);
            actions = true;
        }
    }
});
setTick(function () {
    if (actions) {
        DisableControlAction(0, 1, true);
        DisableControlAction(0, 2, true);
        DisableControlAction(0, 142, true);
        DisableControlAction(0, 18, true);
        DisableControlAction(0, 106, true);
    }
});
