// Filtre que l'on utilisera sur les employees

import {  
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider, 
  Box
} from '@chakra-ui/react'
import React, { useContext, useEffect, useState } from 'react'
import { ChevronDownIcon,ChevronRightIcon } from '@chakra-ui/icons'
import { getSelectedValues } from '@chakra-ui/utils';
import { Hide, Show } from '@chakra-ui/media-query';
import { IconButton } from '@chakra-ui/react';

function FilterProductEmployee(props) {
//   const [filterValues, setFilterValues] = useState({ group1: 'nom', group2: 'asc' });

//   const onFilterValueChange = (group, value) => {
//     setFilterValues((prevValues) => ({
//       ...prevValues,
//       [group]: value
//     }));

//   };
//    props.setFilterValues(filterValues);
        // console.log(filterValues);

//   const handleApplyFilters = () => {
//     console.log(filterValues);
//     // Vous pouvez effectuer d'autres actions avec les valeurs sélectionnées ici
//   };

  return (
    <Box>
      
      <Show below='md'>
     <Menu closeOnSelect={false}>
        <MenuButton 
        as={IconButton}
    // aria-label='Options'
    icon={<ChevronDownIcon />}
    variant='outline'
        px={4} py={2}
       
        //  width={['60%', '80%', '70%', '100%']}
        //     maxWidth="300px"
          />
       
        <MenuList minWidth='240px'>
          <MenuOptionGroup defaultValue={props.filterValue.group1} type='radio' title='Trier par' onChange={(value) => props.fonction('group1', value)}>
            <MenuItemOption value='nom'>Nom</MenuItemOption>
            <MenuItemOption value='Admin'>Admin</MenuItemOption>
            <MenuItemOption value='Employee'>Employé</MenuItemOption>
            <MenuItemOption value='intermediaire'>Adjoint</MenuItemOption>
          </MenuOptionGroup>
          <MenuDivider />
          <MenuOptionGroup defaultValue={props.filterValue.group2} type='radio' title='Ordre' onChange={(value) => props.fonction('group2', value)}>
            <MenuItemOption value='asc'>Croissant</MenuItemOption>
            <MenuItemOption value='desc'>Décroissant</MenuItemOption>
          </MenuOptionGroup>
        </MenuList>
      </Menu>

          </Show>
          
          <Hide below='md'>
     <Menu closeOnSelect={false}>
        <MenuButton px={4} py={2} borderBottom='md' borderBottomWidth='1px'
         w='300px'
        //  width={['60%', '80%', '70%', '100%']}
        //     maxWidth="300px"
         >
          -- Trier par -- <ChevronDownIcon />
        </MenuButton>
        <MenuList minWidth='240px'>
          <MenuOptionGroup defaultValue={props.filterValue.group1} type='radio' onChange={(value) => props.fonction('group1', value)}>
            <MenuItemOption value='nom'>Nom</MenuItemOption>
            <MenuItemOption value='Admin'>Admin</MenuItemOption>
            <MenuItemOption value='Employee'>Employé</MenuItemOption>
            <MenuItemOption value='intermediaire'>Adjoint</MenuItemOption>
          </MenuOptionGroup>
          <MenuDivider />
          <MenuOptionGroup defaultValue={props.filterValue.group2} type='radio' onChange={(value) => props.fonction('group2', value)}>
            <MenuItemOption value='asc'>Croissant</MenuItemOption>
            <MenuItemOption value='desc'>Décroissant</MenuItemOption>
          </MenuOptionGroup>
        </MenuList>
      </Menu>
          </Hide>
      
      {/* <button onClick={handleApplyFilters}>Appliquer les filtres</button> */}
    </Box>
  );
}

export default FilterProductEmployee;