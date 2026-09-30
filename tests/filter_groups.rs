use member_id::utils::filter_groups;

#[test]
fn keeps_only_allowlisted_groups_in_order() {
    let input = vec![
        "mitglieder".into(),
        "events".into(),
        "Authentik Admins".into(),
        "vorstand".into(),
        "organisation".into(),
        "management".into(),
        "design-pr".into(),
        "hr".into(),
        "engineering".into(),
        "random".into(),
    ];
    assert_eq!(
        filter_groups(&input),
        vec![
            "Vorstand",
            "Management",
            "Organisation",
            "Engineering",
            "Design-PR",
            "HR",
            "Events",
        ]
    );
}

#[test]
fn matches_groups_case_insensitively() {
    let input = vec!["VORSTAND".into(), "Hr".into()];
    assert_eq!(filter_groups(&input), vec!["Vorstand", "HR"]);
}

#[test]
fn returns_empty_when_no_display_groups() {
    assert_eq!(
        filter_groups(&["mitglieder".into(), "Authentik Admins".into()]),
        Vec::<String>::new()
    );
}

#[test]
fn capitalizes_ehrenmitglied_and_events() {
    let input = vec!["ehrenmitglied".into(), "events".into()];
    assert_eq!(filter_groups(&input), vec!["Ehrenmitglied", "Events"]);
}
