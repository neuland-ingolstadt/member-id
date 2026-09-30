use chrono::{NaiveDate, TimeZone, Utc};
use member_id::utils::semester_for_date;

#[test]
fn summer_semester_mid_year() {
    let today = NaiveDate::from_ymd_opt(2026, 6, 1).unwrap();
    let (code, end, label) = semester_for_date(today);
    assert_eq!(code, "SS26");
    assert_eq!(
        end,
        Utc.with_ymd_and_hms(2026, 9, 30, 23, 59, 59)
            .single()
            .unwrap()
    );
    assert_eq!(label, "Sommersemester 2026");
}

#[test]
fn winter_semester_after_summer() {
    let today = NaiveDate::from_ymd_opt(2026, 11, 15).unwrap();
    let (code, end, label) = semester_for_date(today);
    assert_eq!(code, "WS26");
    assert_eq!(
        end,
        Utc.with_ymd_and_hms(2027, 3, 14, 23, 59, 59)
            .single()
            .unwrap()
    );
    assert_eq!(label, "Wintersemester 2026/2027");
}

#[test]
fn winter_semester_before_summer_start() {
    let today = NaiveDate::from_ymd_opt(2026, 2, 1).unwrap();
    let (code, end, label) = semester_for_date(today);
    assert_eq!(code, "WS25");
    assert_eq!(
        end,
        Utc.with_ymd_and_hms(2026, 3, 14, 23, 59, 59)
            .single()
            .unwrap()
    );
    assert_eq!(label, "Wintersemester 2025/2026");
}

#[test]
fn summer_semester_on_boundary_dates() {
    let start = NaiveDate::from_ymd_opt(2026, 3, 15).unwrap();
    let end = NaiveDate::from_ymd_opt(2026, 9, 30).unwrap();
    assert_eq!(semester_for_date(start).0, "SS26");
    assert_eq!(semester_for_date(end).0, "SS26");
}
