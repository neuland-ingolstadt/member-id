use member_id::passes::remove_nulls;
use serde_json::json;

#[test]
fn strips_null_fields_from_object() {
    let mut value = json!({"a": 1, "b": null, "c": {"d": null, "e": 2}});
    remove_nulls(&mut value);
    assert_eq!(value, json!({"a": 1, "c": {"e": 2}}));
}

#[test]
fn strips_nulls_inside_arrays() {
    let mut value = json!([{"x": null}, {"y": 1}]);
    remove_nulls(&mut value);
    assert_eq!(value, json!([{}, {"y": 1}]));
}

#[test]
fn leaves_non_null_scalars_unchanged() {
    let mut value = json!({"flag": false, "count": 0, "name": "ok"});
    remove_nulls(&mut value);
    assert_eq!(value, json!({"flag": false, "count": 0, "name": "ok"}));
}
