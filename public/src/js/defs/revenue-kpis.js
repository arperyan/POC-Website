var revenueKPIsDef = {
  qInfo: {
    qType: "HeaderKPIs"
  },
  YTDRevenue: {
    value: {
      qStringExpression: "Num(Sum({$<Year={2016}>}#Revenue),'£#,##0')"
    },
    label: {
      qStringExpression: "='YEAR TO DATE REVENUE ($k)'"
    }
  },
  PriorYearRevenue: {
    value: {
      qStringExpression: "Num(Sum({$<Year={2015}>}#Revenue),'£#,##0')"
    },
    label: {
      qStringExpression: "='PRIOR YEAR REVENUE ($k)'"
    }
  },
  YearOnYearRevenue: {
    value: {
      qStringExpression: "Num((Sum({$<Year={2016}>}#Revenue)-Sum({$<Year={2015}>}#Revenue)) / Sum({$<Year={2015}>}#Revenue),'#,##0%')"
    },
    label: {
      qStringExpression: "='YEAR ON YEAR VARIATION'"
    }
  }
}
