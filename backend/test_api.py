import requests
import json

BASE_URL = "http://localhost:8000"

sample_data = {
    "data": [
        {
            "country": "Nigeria",
            "year": 2020,
            "gdp_growth": 1.8,
            "poverty_rate": 40.1,
            "health_expenditure": 3.9,
            "education_expenditure": 5.6,
            "unemployment": 27.1,
            "capital_expenditure": 18.5,
            "gini_index": 35.1
        },
        {
            "country": "Kenya",
            "year": 2020,
            "gdp_growth": 5.4,
            "poverty_rate": 36.8,
            "health_expenditure": 5.2,
            "education_expenditure": 18.5,
            "unemployment": 5.7,
            "capital_expenditure": 24.2,
            "gini_index": 40.8
        },
        {
            "country": "Ghana",
            "year": 2020,
            "gdp_growth": 6.5,
            "poverty_rate": 23.4,
            "health_expenditure": 6.8,
            "education_expenditure": 21.2,
            "unemployment": 4.5,
            "capital_expenditure": 32.1,
            "gini_index": 43.5
        },
        {
            "country": "South Africa",
            "year": 2020,
            "gdp_growth": 0.2,
            "poverty_rate": 55.5,
            "health_expenditure": 8.3,
            "education_expenditure": 19.8,
            "unemployment": 29.2,
            "capital_expenditure": 22.4,
            "gini_index": 63.0
        },
        {
            "country": "Ethiopia",
            "year": 2020,
            "gdp_growth": 6.1,
            "poverty_rate": 23.5,
            "health_expenditure": 3.5,
            "education_expenditure": 26.9,
            "unemployment": 2.1,
            "capital_expenditure": 28.3,
            "gini_index": 35.0
        }
    ]
}

def test_health():
    print("\n=== Testing Health Endpoint ===")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")

def test_analyze():
    print("\n=== Testing Analyze Endpoint ===")
    response = requests.post(f"{BASE_URL}/api/analyze", json=sample_data)
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Row Count: {result['rowCount']}")
    print(f"Column Count: {result['columnCount']}")
    print(f"\nSample Column Analysis (poverty_rate):")
    if 'poverty_rate' in result['columns']:
        col_info = result['columns']['poverty_rate']
        print(json.dumps(col_info, indent=2))

def test_sdg_insights():
    print("\n=== Testing SDG Insights Endpoint ===")
    response = requests.post(f"{BASE_URL}/api/sdg-insights", json=sample_data)
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Total Insights: {result['totalInsights']}")
    print(f"SDG Count: {result['sdgCount']}")
    print(f"Data Quality: {result['dataQuality']}")

    print("\n--- Insights Summary ---")
    for insight in result['insights']:
        print(f"\nSDG {insight['sdgNumber']}: {insight['sdgName']}")
        print(f"  Indicator: {insight['indicator']}")
        print(f"  Value: {insight['value']} {insight['unit']}")
        print(f"  Status: {insight['status'].upper()}")
        print(f"  Trend: {insight['trend']}")
        print(f"  Assessment: {insight['assessment']}")
        print(f"  Recommendation: {insight['recommendation'][:100]}...")

def test_clean():
    print("\n=== Testing Clean Endpoint ===")

    dirty_data = sample_data.copy()
    dirty_data['data'].append({
        "country": "Rwanda",
        "year": 2020,
        "gdp_growth": None,
        "poverty_rate": 38.2,
        "health_expenditure": 6.5,
        "education_expenditure": None,
        "unemployment": 1.8,
        "capital_expenditure": 26.7,
        "gini_index": 43.7
    })

    clean_request = {
        "data": dirty_data['data'],
        "options": {
            "handleMissing": "fillMedian",
            "removeDuplicates": True,
            "handleOutliers": "cap",
            "outlierThreshold": 1.5
        }
    }

    response = requests.post(f"{BASE_URL}/api/clean", json=clean_request)
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Original Count: {result['originalCount']}")
    print(f"Cleaned Count: {result['cleanedCount']}")
    print(f"Rows Removed: {result['rowsRemoved']}")
    print(f"Stats: {json.dumps(result['stats'], indent=2)}")

def test_correlation():
    print("\n=== Testing Correlation Matrix Endpoint ===")
    response = requests.post(f"{BASE_URL}/api/correlation-matrix", json=sample_data)
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Columns: {result['columns']}")
    print("\nCorrelation between poverty_rate and gdp_growth:")
    if 'poverty_rate' in result['correlation']:
        corr = result['correlation']['poverty_rate'].get('gdp_growth', 'N/A')
        print(f"  Correlation: {corr}")

def run_all_tests():
    print("=" * 60)
    print("SDG Policy Intelligence API - Test Suite")
    print("=" * 60)

    try:
        test_health()
        test_analyze()
        test_sdg_insights()
        test_clean()
        test_correlation()

        print("\n" + "=" * 60)
        print("All tests completed successfully!")
        print("=" * 60)

    except requests.exceptions.ConnectionError:
        print("\nERROR: Could not connect to the API server.")
        print("Please make sure the server is running:")
        print("  python main.py")
        print("or")
        print("  uvicorn main:app --reload")

    except Exception as e:
        print(f"\nERROR: {str(e)}")

if __name__ == "__main__":
    run_all_tests()
