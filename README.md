[![PivotDrill](https://github.com/sjb-ch1mp/PivotDrill/blob/master/img/readme/banner.png)](https://github.com/sjb-ch1mp/PivotDrill/blob/master/README.md)

[![Creative Commons License](https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png)](http://creativecommons.org/licenses/by-nc-sa/4.0/)

### Author 
Samuel Brookes ([@sjb-ch1mp](https://github.com/sjb-ch1mp))

# Contents

**[SUMMARY](#summary)**
 
> _[Installation](#installation)_ > _[Bug Reporting](#bug-reporting)_

**[USER GUIDE](#user-guide)** 

**[CHANGE LOG](#change-log)**  

# Summary
PivotDrill is a simple tool for exploring and summarizing JSON data. 

### Installation
PivotDrill does not require any installation. Simply download the zip file from the [PivotDrill repository](https://github.com/sjb-ch1mp/PivotDrill), decompress it and open the file 'PivotDrill.html' in a browser.

### Bug Reporting
If PivotDrill encounters an error, the error message will be announced in the top banner and the stack trace will be dumped to the console. If you encounter any bugs or errors while using PivotDrill, please feel free to add them as an issue in the PivotDrill repository.

My preference is that you use the error message as the issue title and paste the stack trace in the comment section.

# User Guide

### Submitting a JSON file
PivotDrill only accepts JSON files (MIME type "application/json"). To upload a file, click the `Browse...` button at the top right, select your file and click `OK`.

## Workspace
The PivotDrill workspace is divided into three sections: the `FIELDS` panel, the `PIVOT` panel, and the `DRILL` panel. 

Each panel can be expanded to fill the entire workspace by clicking on the red banner at the bottom of the panel.

Each panel also contains a menu. This can be expanded by clicking the left-hand button in the blue banner at the top of the panel. 

The functionality of PivotDrill will be explained by describing each panel separately. Throughout this guide, I will be using the following JSON file (example.json) to demonstrate how PivotDrill works. 

**example.json**
```
{
	"meta_key_1":"meta_value_1",
	"meta_key_2":["meta_value_2","meta_value_3","meta_value_4"],
	"root_key":{
		"key_1":"value_1",
		"key_2":{
			"key_a":{
				"key_i": "value_i",
				"key_ii": "value_ii",
				"key_iii": "value_iii",
				"key_iv": ["value_iv","value_v","value_vi"],
				"key_v": "value_vii"
			},
			"key_b":{
				"key_i": "value_vii",
				"key_ii": "value_viii",
				"key_iii": "value_ix",
				"key_iv": ["value_x","value_xi","value_xii"]
			},
			"key_c":{
				"key_i": "value_xiii",
				"key_ii": "value_xiv",
				"key_iii": "value_xv",
				"key_iv": ["value_xvi","value_xvii","value_xviii"],
				"key_v": "value_xix"
			},
			"key_d":{
				"key_i": "value_xx",
				"key_ii": "value_xxi",
				"key_iii": "value_xxii",
				"key_iv": ["value_xxiii","value_xxiv","value_xxv"]
			}
		},
		"key_3":[
			"value_2",
			"value_3",
			"value_4",
			"value_5"
		]
	}
} 
```

### FIELDS Panel
When a new JSON file is uploaded to PivotDrill, all unique valued keys (i.e. with at least one non-null value) are 'flattened', summarized and saved as a 'dataset' in the `FIELDS` panel. Saved datasets can be accessed by expanding the `FIELDS` panel menu.

**example.json after uploading to PivotDrill:**

![field_1](https://github.com/sjb-ch1mp/PivotDrill/blob/master/img/readme/field_1.png)

#### Parent Keys
Keys that share a common parent are grouped together beneath that parent key. By clicking on a parent key, a new dataset is created with the name `ROOT_<parent_key>`, consisting of all unique valued keys of all children of that parent. In the example below, 3 new datasets are created by clicking the `root_key` parent, the `key_2` parent, and the `key_a` parent.

**ROOT_ROOT_KEY dataset fields:**

![field_2](https://github.com/sjb-ch1mp/PivotDrill/blob/master/img/readme/field_2.png)

**ROOT_ROOT_KEY dataset (raw):**
```
{
    "key_1":"value_1",
    "key_2":{
        "key_a":{
            "key_i": "value_i",
            "key_ii": "value_ii",
            "key_iii": "value_iii",
            "key_iv": ["value_iv","value_v","value_vi"],
            "key_v": "value_vii"
        },
        "key_b":{
            "key_i": "value_vii",
            "key_ii": "value_viii",
            "key_iii": "value_ix",
            "key_iv": ["value_x","value_xi","value_xii"]
        },
        "key_c":{
            "key_i": "value_xiii",
            "key_ii": "value_xiv",
            "key_iii": "value_xv",
            "key_iv": ["value_xvi","value_xvii","value_xviii"],
            "key_v": "value_xix"
        },
        "key_d":{
            "key_i": "value_xx",
            "key_ii": "value_xxi",
            "key_iii": "value_xxii",
            "key_iv": ["value_xxiii","value_xxiv","value_xxv"]
        }
    },
    "key_3":[
        "value_2",
        "value_3",
        "value_4",
        "value_5"
    ]
}
```

**ROOT_KEY_2 dataset fields:**

![field_3](https://github.com/sjb-ch1mp/PivotDrill/blob/master/img/readme/field_3.png)

**ROOT_KEY_2 dataset (raw):**
```
{
    "key_a":{
        "key_i": "value_i",
        "key_ii": "value_ii",
        "key_iii": "value_iii",
        "key_iv": ["value_iv","value_v","value_vi"],
        "key_v": "value_vii"
    },
    "key_b":{
        "key_i": "value_vii",
        "key_ii": "value_viii",
        "key_iii": "value_ix",
        "key_iv": ["value_x","value_xi","value_xii"]
    },
    "key_c":{
        "key_i": "value_xiii",
        "key_ii": "value_xiv",
        "key_iii": "value_xv",
        "key_iv": ["value_xvi","value_xvii","value_xviii"],
        "key_v": "value_xix"
    },
    "key_d":{
        "key_i": "value_xx",
        "key_ii": "value_xxi",
        "key_iii": "value_xxii",
        "key_iv": ["value_xxiii","value_xxiv","value_xxv"]
    }
}
```

**ROOT_KEY_A dataset fields:**

![field_4](https://github.com/sjb-ch1mp/PivotDrill/blob/master/img/readme/field_4.png)

**ROOT_KEY_A dataset (raw):**
```
{
    "key_i": "value_i",
    "key_ii": "value_ii",
    "key_iii": "value_iii",
    "key_iv": ["value_iv","value_v","value_vi"],
    "key_v": "value_vii"
}
```

#### Merging Siblings
As you can see above, the `ROOT_KEY_2` dataset comprises of 4 siblings which share common keys, e.g. `key_i`, `key_ii`, etc. By holding the `ALT` key on your keyboard and clicking on one of these common keys, the siblings will be 'merged' into a new dataset with the name `MERGE_<merge_key>`.

Merging siblings removes the parent keys from the common keys so that they can be summarised in the `PIVOT` panel.

**MERGE_KEY_I dataset fields:**

![field_merge_1](https://github.com/sjb-ch1mp/PivotDrill/blob/master/img/readme/field_merge_1.png)

**MERGE_KEY_I dataset (raw):**
```
[
	{
		"key_i": "value_i",
		"key_ii": "value_ii",
		"key_iii": "value_iii",
		"key_iv": ["value_iv","value_v","value_vi"],
		"key_v": "value_vii",
		"pivotdrill_metafield_parent":"key_a"
	},
	{
		"key_i": "value_vii",
		"key_ii": "value_viii",
		"key_iii": "value_ix",
		"key_iv": ["value_x","value_xi","value_xii"],
		"pivotdrill_metafield_parent":"key_b"
	},
	{
		"key_i": "value_xiii",
		"key_ii": "value_xiv",
		"key_iii": "value_xv",
		"key_iv": ["value_xvi","value_xvii","value_xviii"],
		"key_v": "value_xix",
		"pivotdrill_metafield_parent":"key_c"
	},
	{
		"key_i": "value_xx",
		"key_ii": "value_xxi",
		"key_iii": "value_xxii",
		"key_iv": ["value_xxiii","value_xxiv","value_xxv"],
		"pivotdrill_metafield_parent":"key_d"
	}
]
```

### PIVOT Panel

# Change Log
|Date|Change Type|Applicable to Version|Description|
|---|---|---|---|
|2021-01-31 | VERSION | 1.0.0 | Version 1.0.0 committed. |
|2021-02-04 | BUG | 1.0.0 | Cleaned up console.log() debug messages ([Issue #4](https://github.com/sjb-ch1mp/PivotDrill/issues/4)). Parsing of malformed JSON files now fails gracefully ([Issue #3](https://github.com/sjb-ch1mp/PivotDrill/issues/3)).|