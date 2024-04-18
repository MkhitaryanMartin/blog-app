export function customFilter(values, selectedOption, user, searchBlog) {
    return values.filter((value) => {
        if (selectedOption && user) {
            return value?.blogTitle.toLowerCase().includes(searchBlog.toLowerCase()) && user?.uid === value.uid;
        } else {
            console.log("else", selectedOption);
            return value?.blogTitle.toLowerCase().includes(searchBlog.toLowerCase());
        }
    });
}