function getTestJSON(){
    let process = {
        "all_segments": true,
        "terms": [
            "chrome.exe"
        ],
        "total_results": 231,
        "highlights": [
            {
                "name": "c:\\program files (x86)\\google\\chrome\\application\\PREPREPREchrome.exePOSTPOSTPOST",
                "ids": [
                    "00000001-0000-1028-01d2-c24179cca1b8-015bc2a3ebe8",
                    "00000001-0000-1028-01d2-c24179cca1b8-015bc2a3ebe8",
                    "00000001-0000-0650-01d2-c273a7ba8b36-015bc3ed7ed8",
                    "00000001-0000-0650-01d2-c273a7ba8b36-015bc3ed7ed8",
                    "00000001-0000-020c-01d2-c273a79d8c63-015bc3ed7ed8",
                    "00000001-0000-020c-01d2-c273a79d8c63-015bc3ed7ed8",
                    "00000001-0000-08dc-01d2-c273a7b337f2-015bc3ed7ed8",
                    "00000001-0000-08dc-01d2-c273a7b337f2-015bc3ed7ed8",
                    "00000001-0000-1234-01d2-c273a77198f9-015bc3ed7ed8",
                    "00000001-0000-1234-01d2-c273a77198f9-015bc3ed7ed8",
                    "00000001-0000-0e4c-01d2-c273a780b4a2-015bc3ed7ed8",
                    "00000001-0000-0e4c-01d2-c273a780b4a2-015bc3ed7ed8",
                    "00000001-0000-12fc-01d2-c273a7c1de71-015bc3ed7ed8",
                    "00000001-0000-12fc-01d2-c273a7c1de71-015bc3ed7ed8",
                    "00000001-0000-0778-01d2-c273a7966030-015bc3ed7ed8",
                    "00000001-0000-0778-01d2-c273a7966030-015bc3ed7ed8",
                    "00000001-0000-12f8-01d2-c273a7ac0cb4-015bc3ed7ed8",
                    "00000001-0000-12f8-01d2-c273a7ac0cb4-015bc3ed7ed8",
                    "00000001-0000-121c-01d2-c273a7882eec-015bc3ed7ed8",
                    "00000001-0000-121c-01d2-c273a7882eec-015bc3ed7ed8"
                ]
            },
            {
                "name": "PREPREPREchrome.exePOSTPOSTPOST",
                "ids": [
                    "00000001-0000-1028-01d2-c24179cca1b8-015bc2a3ebe8",
                    "00000001-0000-0650-01d2-c273a7ba8b36-015bc3ed7ed8",
                    "00000001-0000-020c-01d2-c273a79d8c63-015bc3ed7ed8",
                    "00000001-0000-08dc-01d2-c273a7b337f2-015bc3ed7ed8",
                    "00000001-0000-1234-01d2-c273a77198f9-015bc3ed7ed8",
                    "00000001-0000-0e4c-01d2-c273a780b4a2-015bc3ed7ed8",
                    "00000001-0000-12fc-01d2-c273a7c1de71-015bc3ed7ed8",
                    "00000001-0000-0778-01d2-c273a7966030-015bc3ed7ed8",
                    "00000001-0000-12f8-01d2-c273a7ac0cb4-015bc3ed7ed8",
                    "00000001-0000-121c-01d2-c273a7882eec-015bc3ed7ed8"
                ]
            }
        ],
        "facets": {},
        "results": [
            {
                "process_md5": "92b29e6be97f5b2c5894904d1447bbfe",
                "sensor_id": 1,
                "filtering_known_dlls": false,
                "modload_count": 0,
                "parent_unique_id": "00000001-0000-0ee8-01d2-7292dd56b66f-000000000001",
                "cmdline": "\"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe\" --type=utility --lang=en-US --no-sandbox --service-request-channel-token=8EEC283107F82FAA8460327787795CD2 --mojo-platform-channel-handle=4540 /prefetch:8",
                "last_update": "2017-05-01T06:09:22.081Z",
                "id": "00000001-0000-1028-01d2-c24179cca1b8",
                "parent_name": "chrome.exe",
                "parent_md5": "000000000000000000000000000000",
                "group": "default group",
                "parent_id": "00000001-0000-0ee8-01d2-7292dd56b66f",
                "hostname": "win-ia9nq1gn8oi",
                "filemod_count": 2,
                "start": "2017-05-01T06:09:21.928Z",
                "comms_ip": -1407842931,
                "regmod_count": 0,
                "interface_ip": -1407842931,
                "process_pid": 4136,
                "username": "WIN-IA9NQ1GN8OI\\bit9rad",
                "terminated": true,
                "emet_config": "",
                "process_name": "chrome.exe",
                "emet_count": 0,
                "last_server_update": "2017-05-01T06:12:54.386Z",
                "path": "c:\\program files (x86)\\google\\chrome\\application\\chrome.exe",
                "netconn_count": 0,
                "parent_pid": 3816,
                "crossproc_count": 0,
                "segment_id": 1493619174376,
                "host_type": "workstation",
                "processblock_count": 0,
                "os_type": "windows",
                "childproc_count": 0,
                "unique_id": "00000001-0000-1028-01d2-c24179cca1b8-015bc2a3ebe8"
            }
        ],
        "tagged_pids": {},
        "elapsed": 0.043354034423828125,
        "start": 0,
        "comprehensive_search": true,
        "incomplete_results": false,
        "filtered": {}
    };
    return JSON.stringify(process);
}

function getTestValues(){
    let values = [];
    for(let i=0; i<30; i++){
        values.push('test-value-' + i);
    }
    return values;
}