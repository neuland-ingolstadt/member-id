use member_id::utils::format_groups_label;

#[test]
fn joins_up_to_three_groups() {
    let groups = vec!["vorstand".into(), "hr".into()];
    assert_eq!(format_groups_label(&groups), "Vorstand, HR");
}

#[test]
fn truncates_with_plus_count_beyond_three() {
    let groups = vec![
        "vorstand".into(),
        "management".into(),
        "organisation".into(),
        "engineering".into(),
        "events".into(),
        "mitglieder".into(),
    ];
    assert_eq!(
        format_groups_label(&groups),
        "Vorstand, Management, Organisation +2"
    );
}
