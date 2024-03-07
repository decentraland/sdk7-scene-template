import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Label, ReactEcsRenderer, UiEntity, Input, Dropdown, Button } from '@dcl/sdk/react-ecs'
import {engine, UiCanvasInformation} from '@dcl/sdk/ecs'
import {
    changeRealm,
    movePlayerTo,
    openExternalUrl, openNftDialog,
    teleportTo,
    triggerEmote,
    triggerSceneEmote
} from "~system/RestrictedActions";

const description = "This is an example of a text that is too long to fit in a single line. It will be broken into multiple lines.\n\nBelow is an example of a static background."
const Max_Chars = 45
const avatarImage = "images/avatar.png"
const rickAndMortyImage = "images/RickMortyLogo.png"
const dropdownOptions = [`Red`, `Blue`, `Green`]
let selectedColor = Color4.Clear()
let selectedOption = ''
let enteredText = ''
let buttonClicked = ''

export function setupUi() {
    ReactEcsRenderer.setUiRenderer(uiComponent)
}

const uiComponent = () => (
    [
        //OnlyTransformsAndTextsUIExample(),
        //UIInputExample(),
        //UIDropdownExample(),
        //TestButton(),
        //descriptionUI(),
        GitHubLinkUi()
    ]
)

function OnlyTransformsAndTextsUIExample() {
    return <UiEntity
        uiTransform={{
            width: 500,
            height: 300,
            positionType: 'absolute',
            position: { top: '10%', left: '15%' },
            margin: '0',
            padding: 4,
        }}
        uiBackground={{ color: Color4.fromHexString("#4d544e") }}
    >
        <UiEntity
            uiTransform={{
                width: '100%',
                height: '100%',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}
            uiBackground={{ color: Color4.fromHexString("#4d814e") }}
        >
            <UiEntity
                uiTransform={{
                    width: '100%',
                    height: 30,
                    margin: '8px 0'
                }}
                uiText={{
                    value: 'Static Text 1',
                    fontSize: 35,
                    color: Color4.Yellow()
                }}
            />
            <Label
                value={'Static Text 2'}
                fontSize={30}
                color={Color4.Red()}
                uiTransform={{ width: '100%', height: 30 } }
                font={'serif'}
            />
            <Label
                value={'Static Text 3'}
                fontSize={25}
                color={Color4.Black()}
                uiTransform={{ width: '100%', height: 30 } }
                onMouseDown={() => {
                    buttonClicked = 'TEXT 3 Button down at ' + getTime()
                }}
                onMouseUp={() => {
                    buttonClicked = 'TEXT 3 Button up at ' + getTime()
                }}
            />
            <Label
                value={'Static Text 4'}
                fontSize={20}
                color={Color4.Blue()}
                uiTransform={{ width: '100%', height: 30 } }
            />
            <Label
                value={'Static Text 5'}
                fontSize={15}
                color={Color4.Magenta()}
                uiTransform={{ width: '100%', height: 30 } }
            />
            <Label
                value={'Dynamic Text\n' + getTime()}
                fontSize={30}
                uiTransform={{ width: '100%', height: 80 } }
            />
        </UiEntity>
        <UiEntity
            uiTransform={{
                width: '100%',
                height: '100%',
                margin: '0 0 0 5'
            }}
            uiBackground={{
                textureMode: 'center',
                texture: {
                    src: getRandomImage()
                }
            }}
            uiText={{
                value: 'Background example\n(dynamic texture)',
                fontSize: 20,
                color: Color4.Yellow(),
                textAlign: 'top-center'
            }}
        />
    </UiEntity>
}

function UIInputExample() {
    return <UiEntity
        uiTransform={{
            width: 500,
            height: 80,
            margin: '0 0 0 520px',
            positionType: 'absolute',
            position: { top: '10%', left: '15%' },
        }}
    >
        <Input
            onSubmit={(value) => {
                enteredText = 'Submitted value: ' + value
            }}
            onChange={(value) => {
                enteredText = 'Entering value: ' + value
            }}
            fontSize={35}
            placeholder={'Input example...'}
            placeholderColor={Color4.Gray()}
            color={Color4.Black()}
            uiTransform={{
                width: '400px',
                height: '80px'
            }}
            uiBackground={{
                color: Color4.White(),
            }}
            disabled={false}
        ></Input>
        <Label
            value={enteredText}
            fontSize={20}
            color={Color4.White()}
            textAlign={'middle-left'}
            uiTransform={{
                width: '100px',
                height: '80px',
                margin: '0 0 0 10px',
            }}
        />
    </UiEntity>
}

function UIDropdownExample() {
    return <UiEntity
        uiTransform={{
            width: 500,
            height: 50,
            margin: '150px 0 0 520px',
            positionType: 'absolute',
            position: { top: '5%', left: '15%' },
        }}
    >
        <Dropdown
            options={dropdownOptions}
            onChange={selectOption}
            uiTransform={{
                width: '400px',
                height: '50px',
            }}
            uiBackground={{
                color: Color4.Teal(),
            }}
            fontSize={20}
            color={Color4.Black()}
            disabled={false}
            acceptEmpty={true}
            emptyLabel={'-- Dropdown example --'}
        />
        <Label
            value={selectedOption}
            fontSize={20}
            color={Color4.White()}
            textAlign={'middle-left'}
            uiTransform={{
                width: '100px',
                height: '50px',
                margin: '0 0 0 10px',
            }}
        />
        
    </UiEntity>
}

function TestButton() {
    return <UiEntity
        uiTransform={{
            width: 300,
            height: 60,
            margin: '230px 0 0 520px',
            positionType: 'absolute',
            position: { top: '5%', left: '15%' },
        }}
    >
        <Button
            value="Button example"
            fontSize={20}
            variant="primary"
            uiTransform={{ width: 200, height: 60 }}
            onMouseDown={() => {
                buttonClicked = 'BUTTON EXAMPLE down at ' + getTime()
            }}
            onMouseUp={() => {
                buttonClicked = 'BUTTON EXAMPLE up at ' + getTime()
            }}
        />
        <Label
            value={buttonClicked}
            fontSize={20}
            color={Color4.White()}
            textAlign={'middle-left'}
            uiTransform={{
                width: '100px',
                height: '60px',
                margin: '0 0 0 10px',
            }}
        />
    </UiEntity>
}

function descriptionUI() {

    const multiLineDescription = breakLines(description, Max_Chars)

    return <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            positionType: 'absolute',
            position: { right: "3%", bottom: '3%' },
            margin: '0 0 130 0'
        }}
        uiBackground={{ color: Color4.fromHexString("#4d544e") }}
    >
        <UiEntity
            uiTransform={{
                width: "auto",
                height: "auto",
                alignSelf: "center",
                padding: 4,
                justifyContent: 'flex-start',
                alignContent: 'flex-start',
            }}
            uiBackground={{ color: Color4.fromHexString("#92b096") }}
        >
            <Label
                value={multiLineDescription}
                fontSize={18}
                textAlign="middle-center"

                uiTransform={{
                    width: "auto",
                    height: "auto",
                    alignSelf: "center",
                    margin: '16px 16px 8px 16px',

                }}
            />
            <Label
                value={GetCanvasInfo()}
                fontSize={20}
                textAlign="middle-center"

                uiTransform={{
                    width: "auto",
                    height: "auto",
                    alignSelf: "center",
                    margin: '16px 16px 8px 16px',
                }}

                uiBackground={{ color: Color4.fromHexString("#4d544e") }}
            />
        </UiEntity>
    </UiEntity >
}

function GetCanvasInfo() : string {
    let canvasInfo = UiCanvasInformation.get(engine.RootEntity)
    return 'CANVAS INFORMATION' + '\n\n' + 
        'Size: ' + canvasInfo.width + 'x' + canvasInfo.height + '\n' +
        'Device Pixel Ratio: ' + canvasInfo.devicePixelRatio
}

function GitHubLinkUi() {
    
    return <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            positionType: 'absolute',
            position: { right: "3%", bottom: '3%' },
            margin: '0 135 10 0'
        }}
    >
        <UiEntity
            uiTransform={{
                width: '100',
                height: '100',
            }}
            uiBackground={{
                textureMode: 'stretch',
                texture: {
                    src: avatarImage
                }
            }}
            onMouseDown={() => {
                //console.log("OPENING LINK")
                //openExternalUrl({ url: "https://www.google.com" })
                
                //console.log("MOVING PLAYER")
                //movePlayerTo({ newRelativePosition: { x: 15, y: 5, z: 15 }, cameraTarget: { x: 5, y: 0, z: 5 } })

                //console.log("TELEPORTING PLAYER")
                //teleportTo({ worldCoordinates: { x: 20, y: -15 } })

                //console.log("CHANGING REALM")
                //changeRealm({ 
                //    realm: "https://peer.decentraland.org",
                //    message: "SANTI -> Changing realm to peer.decentraland.org"
                //})

                //console.log("TRIGGERING EMOTE")
                //triggerEmote({ predefinedEmote: "robot" })

                //console.log("TRIGGERING SCENE EMOTE")
                //triggerSceneEmote({ src: 'animations/Snowball_Throw.glb', loop: true })

                //console.log("SHOWING NFT DIALOG")
                openNftDialog({ urn: "urn:decentraland:ethereum:erc721:0x06012c8cf97bead5deae237070f9587f8e7a266d:1540722" })
            }}
        />
        <Label
            value="Test Restricted Action"
            color={Color4.Black()}
            fontSize={18}
            textAlign="middle-center"
        />
    </UiEntity>
}

function breakLines(text: string, linelength: number) {
    const lineBreak = '\n'
    var counter = 0
    var line = ''
    var returnText = ''
    var bMatchFound = false
    const lineLen = linelength ? linelength : 50


    if (!text) return ''
    if (text.length < lineLen + 1) { return text }

    while (counter < text.length) {
        line = text.substring(counter, counter + lineLen);
        bMatchFound = false
        if (line.length == lineLen) {
            for (var i = line.length; i > -1; i--) {
                if (line.substring(i, i + 1) == ' ') {
                    counter += line.substring(0, i).length
                    line = line.substring(0, i) + lineBreak
                    returnText += line
                    bMatchFound = true
                    break
                }
            }

            if (!bMatchFound) {
                counter += line.length
                line = line + lineBreak
                returnText += line
            }
        }
        else {
            returnText += line
            break // We're breaking out of the the while(), not the for()
        }
    }

    return returnText
}

function getTime() {
    const date = new Date()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
}

function getRandomImage() : string {
    const date = new Date()
    const seconds = date.getSeconds()
    if (seconds % 2 == 0) {
        return rickAndMortyImage
    } else {
        return avatarImage
    }
}

function selectOption(index: number) {
    switch (index) {
        case 0:
            selectedColor =  Color4.Red()
            break
        case 1:
            selectedColor = Color4.Blue()
            break
        case 2:
            selectedColor = Color4.Green()
            break
    }

    selectedOption = 'Selected option: ' + dropdownOptions[index]
}
