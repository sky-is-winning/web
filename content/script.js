import fs from 'fs';

let rooms = ['agentlobbymulti', 'shipquarters', 'boxdimension', 'dojoextsolo', 'cloudforest', 'hotellobby', 'pufflewild', 'underwater', 'partysolo1', 'hotelroof', 'skatepark', 'dojowater', 'soundroom', 'partygame', 'agentcom', 'dojosnow', 'shiphold', 'shipnest', 'hotelspa', 'dojofire', 'cavemine', 'cavemine', 'village', 'dojoext', 'party10', 'party11', 'party12', 'party13', 'party14', 'party15', 'party16', 'party17', 'party18', 'party19', 'party24', 'party25', 'party26', 'party27', 'party28', 'party99', 'party19', 'coffee', 'lounge', 'school', 'beacon', 'boiler', 'forest', 'party1', 'party2', 'party3', 'party4', 'party5', 'party6', 'party7', 'party8', 'party9', 'dance', 'lodge', 'attic', 'plaza', 'pizza', 'beach', 'light', 'forts', 'agent', 'shack', 'party', 'town', 'book', 'shop', 'dojo', 'mall', 'ship', 'park', 'dock', 'rink', 'berg', 'cave', 'mine', 'cove', 'lake', 'mtn', 'pet', 'ufo']
for (let folder of fs.readdirSync('.')) {
    if (folder.includes(".")) continue;
    let roomFiles = fs.readdirSync(`./${folder}/media/play/v2/content/global/rooms`);
    roomFiles.forEach(roomFile => {
        let roomName = roomFile.split('.')[0];
        rooms.forEach(room => {
            if (roomName.toLowerCase().includes(room)) {
                fs.renameSync(`./${folder}/media/play/v2/content/global/rooms/${roomFile}`, `./${folder}/media/play/v2/content/global/rooms/${room}.swf`, (err) => {
                    if (err) throw err;
                    console.log(`Copied ${roomFile} to ${room}.swf`);
                });
                return;
            }
        });
    });
}