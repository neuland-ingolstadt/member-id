use member_id::utils::abbreviated_name;

#[test]
fn formats_vorname_and_nachname_initial() {
    assert_eq!(abbreviated_name("Robert", "Eggl"), "Robert E.");
}

#[test]
fn uppercases_initial() {
    assert_eq!(abbreviated_name("Anna", "mueller"), "Anna M.");
}

#[test]
fn abbreviates_fullname_in_given_name_when_family_missing() {
    assert_eq!(abbreviated_name("Robert Eggl", ""), "Robert E.");
    assert_eq!(
        abbreviated_name("Maria Anna Schmidt", "   "),
        "Maria Anna S."
    );
}

#[test]
fn falls_back_when_only_one_name_part() {
    assert_eq!(abbreviated_name("Robert", ""), "Robert");
    assert_eq!(abbreviated_name("Robert", "   "), "Robert");
}

#[test]
fn family_name_only_yields_initial() {
    assert_eq!(abbreviated_name("", "Eggl"), "E.");
}

#[test]
fn trims_whitespace_on_inputs() {
    assert_eq!(abbreviated_name("  Robert  ", "  Eggl  "), "Robert E.");
}
