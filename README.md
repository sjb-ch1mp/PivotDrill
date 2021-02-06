[![PivotDrill](https://github.com/sjb-ch1mp/PivotDrill/blob/master/img/readme/banner.png)](https://github.com/sjb-ch1mp/PivotDrill/blob/master/README.md)

[![Creative Commons License](https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png)](http://creativecommons.org/licenses/by-nc-sa/4.0/)

### Author 
Samuel Brookes ([@sjb-ch1mp](https://github.com/sjb-ch1mp))

# Contents

**[SUMMARY](#summary)**
 
> _[Installation](#installation)_ > _[Bug Reporting](#bug-reporting)_

**[USER GUIDE](#user-guide)** 

> _[Workspace](#workspace)_ > _[FIELDS Panel](#fields-panel)_ > _[PIVOT Panel](#pivot-panel)_ > _[DRILL Panel](#drill-panel)_

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

_example.json_
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

_example.json after uploading to PivotDrill_

![field_1](https://github.com/sjb-ch1mp/PivotDrill/blob/master/img/readme/field_1.png)

##### Parent Keys
Keys that share a common parent are grouped together beneath that parent key. By clicking on a parent key, a new dataset is created with the name `ROOT_<parent_key>`, consisting of all unique valued keys of all children of that parent. In the example below, 3 new datasets are created by clicking the `root_key` parent, the `key_2` parent, and the `key_a` parent.

_ROOT_ROOT_KEY dataset fields_

![field_2](https://github.com/sjb-ch1mp/PivotDrill/blob/master/img/readme/field_2.png)

_ROOT_KEY_2 dataset fields_

![field_3](https://github.com/sjb-ch1mp/PivotDrill/blob/master/img/readme/field_3.png)

_ROOT_KEY_A dataset fields_

![field_4](https://github.com/sjb-ch1mp/PivotDrill/blob/master/img/readme/field_4.png)

##### Merging Siblings
As you can see above, the `ROOT_KEY_2` dataset comprises of 4 siblings which share common keys, e.g. `key_i`, `key_ii`, etc. By holding the `ALT` key on your keyboard and clicking on one of these common keys, the siblings will be 'merged' into a new dataset with the name `MERGE_<merge_key>`.

Merging siblings removes the parent keys from the common keys so that they can be summarised in the `PIVOT` panel. Note that the datasets ROOT_KEY_A and MERGE_KEY_I both have the same fields, but the former contains only those values for `key_a`, while the latter contains the values for all sibling keys `key_a`, `key_b`, `key_c` and `key_d`.

_MERGE_KEY_I dataset fields_

![field_merge_1](https://github.com/sjb-ch1mp/PivotDrill/blob/master/img/readme/field_merge_1.png)

### PIVOT Panel
Clicking on a field button in the `FIELDS` panel will add a table to the `PIVOT` panel that contains a list of all unique values for that key in that dataset. In the example below, all keys in the `MERGE_KEY_I` dataset have been added as 'pivot' tables to the `PIVOT` panel. 

_All keys from the MERGE_KEY_I dataset_

![pivot_1](https://github.com/sjb-ch1mp/PivotDrill/blob/master/img/readme/pivot_1.png)

Pivot tables can be removed from the `PIVOT` panel by clicking on the table header, or toggling the button in the `FIELDS` panel. 

You can download all the currently visible pivot tables into a JSON file by clicking the `DOWNLOAD PIVOT TABLES` button in the `PIVOT` panel menu. 

### DRILL Panel
Clicking on a value in a pivot table will add that key=value pair to the 'drill query' in the `DRILL` panel. Holding the `ALT` key while clicking on a value in a pivot table will add that key=value pair as a NOT conditional, i.e. NOT (key=value). 

When the drill query changes, it will automatically search through the current dataset for any 'entities' in which the drill query evaluates to TRUE, and summarise these as a table in the `DRILL` panel. 

In the example below, the drill query is searching through the current dataset, `MERGE_KEY_I`, for any 'entity' in which the key `key_i` is equal to `value_i`. As you can see, this condition is only true in one out of the four 'entities'.

_Drill query example 1_

![drill_1](https://github.com/sjb-ch1mp/PivotDrill/blob/master/img/readme/drill_1.png)

In the example below, the drill query is searching through the current dataset, `MERGE_KEY_I`, for any 'entity' in which the key `key_i` is NOT equal to `value_i`. As you can see, this condition is true for three out of the four 'entities'.

_Drill query example 2_

![drill_2](https://github.com/sjb-ch1mp/PivotDrill/blob/master/img/readme/drill_2.png)

Note that keys that contain a list as their value are hidden by a toggle-able button `[...]`. You can click on this button to expand or hide the values in the list.

You can save the results of a drill query as a new dataset by clicking the `SAVE AS NEW DATASET` button. This will create a new dataset in the `FIELDS` panel.

Alternatively, you can download the results of a drill query as a JSON file by clicking the `DOWNLOAD DRILL RESULTS` button. 

## Example
In the below example, a JSON file generated by the VirusTotal REST API is uploaded into PivotDrill. PivotDrill is then utilised to extract the details for all engines that have classified the file submitted to VirusTotal as malicious. 

_The file vt-test.json is uploaded to PivotDrill..._

![vt_example_1](https://github.com/sjb-ch1mp/PivotDrill/blob/master/img/readme/vt_example_1.png)

_...I create the dataset `ROOT_LAST_ANALYSIS_RESULTS` by clicking parents `data` > `attributes` > `last_analysis_results`..._

![vt_example_2](https://github.com/sjb-ch1mp/PivotDrill/blob/master/img/readme/vt_example_2.png)

_...I create the dataset `MERGE_CATEGORY` by `ALT`+clicking on the `category` field. By clicking on the value `malicious` in the `category` pivot table, I add this key=value pair to the drill query and the resulting table in the `DRILL` panel summarises the data for all VirusTotal engines that classified the provided file as 'malicious'..._

![vt_example_3](https://github.com/sjb-ch1mp/PivotDrill/blob/master/img/readme/vt_example_3.png)

# Change Log
|Date|Change Type|Applicable to Version|Description|
|---|---|---|---|
|2021-01-31 | VERSION | 1.0.0 | Version 1.0.0 committed. |
|2021-02-04 | BUG | 1.0.0 | Cleaned up console.log() debug messages ([Issue #4](https://github.com/sjb-ch1mp/PivotDrill/issues/4)). Parsing of malformed JSON files now fails gracefully ([Issue #3](https://github.com/sjb-ch1mp/PivotDrill/issues/3)).|
|2021-02-06 | BUG | 1.0.0 | Fixed bug in which restoring hidden drill table columns would create duplicate toggle arrays ([Issue #5](https://github.com/sjb-ch1mp/PivotDrill/issues/5)).|