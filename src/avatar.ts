export function createAvatarShape(x: number, y: number, z: number, spawner = false): Entity {
    const entity = engine.addEntity()

    Transform.create(entity, {
        position: { x, y, z },
        scale: { x: 1, y: 1, z: 1 },
        rotation: { x: 0, y: 0, z: 0, w: 1 }
    })

    AvatarShape.create(entity,{
        id: '0x349834D',
        bodyShape: 'urn:decentraland:off-chain:base-avatars:BaseMale',
        name: 'ElToronto',
        eyeColor: {r: 0.55, g:1, b:1},
        hairColor: {r:1, g:0.55, b:1},
        skinColor: {r:1, g:1, b:0.55},
        talking: false,
        wearables: ['urn:decentraland:off-chain:base-avatars:eyes_00',
            'urn:decentraland:off-chain:base-avatars:f_eyebrows_07',
            "urn:decentraland:off-chain:base-avatars:eyes_02",
            "urn:decentraland:off-chain:base-avatars:f_mouth_03",
            "urn:decentraland:off-chain:base-avatars:f_school_skirt",
            "urn:decentraland:off-chain:base-avatars:SchoolShoes",
            "urn:decentraland:matic:collections-v2:0x177535a421e7867ec52f2cc19b7dfed4f289a2bb:0",
            "urn:decentraland:matic:collections-v2:0xd89efd0be036410d4ff194cd6ecece4ef8851d86:1",
            "urn:decentraland:matic:collections-v2:0x1df3011a14ea736314df6cdab4fff824c5d46ec1:0",
            "urn:decentraland:matic:collections-v2:0xbada8a315e84e4d78e3b6914003647226d9b4001:1",
            "urn:decentraland:matic:collections-v2:0x1df3011a14ea736314df6cdab4fff824c5d46ec1:5",
            "urn:decentraland:matic:collections-v2:0xd89efd0be036410d4ff194cd6ecece4ef8851d86:0"
        ],
        expressionTriggerId: 'RAISE_HAND',
        expressionTriggerTimestamp: 0,
        stickerTriggerId: '2',
        stickerTriggerTimestamp: 0
    })

    return entity
}

export function createAvatarShape2(x: number, y: number, z: number, spawner = false): Entity {
    const entity = engine.addEntity()

    Transform.create(entity, {
        position: { x, y, z },
        scale: { x: 1, y: 1, z: 1 },
        rotation: { x: 0, y: 0, z: 0, w: 1 }
    })
    
    AvatarShape.create(entity,{
        id: '0x7ec943b233798fb45c5d648b106aeefaf2e50f85',
        bodyShape: 'urn:decentraland:off-chain:base-avatars:BaseMale',
        name: 'Basico',
        eyeColor: {r: 0.55, g:1, b:1},
        hairColor: {r:1, g:0.55, b:1},
        skinColor: {r:1, g:1, b:0.55},
        talking: true,
        wearables: ['urn:decentraland:off-chain:base-avatars:eyes_00',
            "urn:decentraland:off-chain:base-avatars:eyebrows_00",
            "urn:decentraland:off-chain:base-avatars:mouth_00",
            "urn:decentraland:off-chain:base-avatars:casual_hair_01",
            "urn:decentraland:off-chain:base-avatars:beard",
            "urn:decentraland:off-chain:base-avatars:green_hoodie",
            "urn:decentraland:off-chain:base-avatars:brown_pants",
            "urn:decentraland:off-chain:base-avatars:sneakers"
        ]
    })

    
    // AvatarShape.create(entity, {
    //     id: '0x7ec943b233798fb45c5d648b106aeefaf2e50f85',
    //     wearables: []
    // })
    
    return entity
}