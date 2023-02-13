const userPortraitRegistryABI = [
    {
        inputs: [],
        name: 'activateKillSwitch',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: '_address', type: 'address' }],
        name: 'getPersonalIpfsCID',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: '_portraitObjectIpfsCID',
                type: 'string',
            },
        ],
        name: 'setPersonalIpfsCIDByOwner',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'address', name: '_address', type: 'address' },
            {
                internalType: 'string',
                name: '_portraitObjectIpfsCID',
                type: 'string',
            },
            { internalType: 'uint256', name: '_blockHeight', type: 'uint256' },
            { internalType: 'bytes', name: '_signature', type: 'bytes' },
        ],
        name: 'setPersonalIpfsCIDByProof',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
export default userPortraitRegistryABI;
