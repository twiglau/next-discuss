
import {Label, SearchField} from "@heroui/react";

export default function TopicSearch() {
    return (

        <SearchField name="search">
            <Label>Search</Label>
            <SearchField.Group>
                <SearchField.SearchIcon />
                <SearchField.Input className="w-[280px]" placeholder="Search..." />
                <SearchField.ClearButton />
            </SearchField.Group>
        </SearchField>
    );
}